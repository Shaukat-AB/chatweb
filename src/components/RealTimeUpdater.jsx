import { setUpdateType } from "../utils/navigationSlice";
import { AddOrSetChannel, AddOrSetUser, AddOrSetDM, getDocuments, createDocRef} from "../utils/storeHelpers";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../utils/userSlice";
import { addChannel } from "../utils/channelSlice";
import { addDM } from "../utils/dmSlice";
import { onSnapshot } from "firebase/firestore";
import {makeUserState, makeDMState, makeChannelState, lastElement, arrCompare} from "../utils/stateHelpers";

let preChannel = null;
let preDM = null;
let preUser = null;

const RealTimeUpdater = () => {
    const channels = useSelector((state) => state.channels);
    const user = useSelector((state) => state.user.user);
    const dms = useSelector((state) => state.dms);
    const dispatch = useDispatch();
    const userRef = user.id && createDocRef("User", user.id);


    const isValidUpdate = (serverUser) => {
        const cond1 = !arrCompare(user?.channelIds, serverUser?.channelIds);
        const cond2 = !arrCompare(user?.dmIds, serverUser?.dmIds);
        return serverUser?.name && (cond1 || cond2);
    }

    const doUpdate = async (serverUser) => {
        console.log("...user state updated", makeUserState(user.id, serverUser));
        dispatch(setUser(makeUserState(user.id, serverUser)));
        const dmIds = serverUser?.dmIds.filter(id => !(id in dms));
        const channelIds = serverUser?.channelIds.filter(id => !(id in channels));
        console.log("new dms are: ", dmIds, " new channels are: ", channelIds);
        (dmIds?.length > 0) && await getDMs(dmIds);
        (channelIds?.length > 0) && await getChannels(channelIds);
    }

    const getDMs = async (dmIds) => {
        const dmObj = await getDocuments("DM", dmIds);
        const dmArr = dmObj ? Object.keys(dmObj) : null;
        if(dmArr.length < 1) return null;
        for(let i = 0; i< dmArr.length; i++){
            let key = dmArr[i];
            dispatch(addDM(makeDMState(key, dmObj[key])));
        }
    }

    const getChannels = async (channelIds) => {
        const chObj = await getDocuments("Channel", channelIds);
        const chArr = chObj ? Object.keys(chObj) : null;
        if(chArr.length < 1) return null;
        for(let i = 0; i<chArr.length; i++){
            let key = chArr[i];
            dispatch(addChannel(makeChannelState(key, chObj[key])));
        }
    }

    useEffect(() => {
        console.log("RealTimeUpdater ran!");
        if (user.id) {
            const unsub = onSnapshot(userRef, async (doc) => {
                const source = doc.metadata.hasPendingWrites
                    ? "Local"
                    : "Server";
                const serverUser = doc.data();
                console.log(source, " Userdata: ", serverUser);
                if (isValidUpdate(serverUser) && source!=="Local") {
                    await doUpdate(serverUser);
                }
            });
            preUser = user;
            preChannel = channels;
            preDM = dms;
            return () => unsub();
        }
    }, []);

    return (
        <>
            <ChannelUpdates />
            <DMUpdates />
            <CurrentUpdates />
        </>
    );
};

const CurrentUpdates = ()=> {

    const channels = useSelector((state) => state.channels);
    const current = useSelector((state) => state.navigation.current);
    const dms = useSelector((state) => state.dms);
    const dispatch = useDispatch();
    const col = current.isChannel ? "Channel" : "DM";
    const currentRef = current.id && createDocRef(col, current.id);

    const isValidUpdate = (serverData) => {
        const target = current.isChannel ? channels : dms;
        const cond1 = !arrCompare(target?.members, serverData?.members);
        const cond2 = !arrCompare(target?.msgIds, serverData?.msgIds);
        return serverData && (cond1 || cond2);
    }

    const doUpdate = (serverData) => {
        col !== "DM"
        ? dispatch(addChannel(makeChannelState(current.id, serverData)))
        : dispatch(addDM(makeDMState(current.id, serverData)));
        console.log(
            current.label, "...state updated",
            col !== "DM"? makeChannelState(current.id, serverData) : makeDMState(current.id, serverData)
        );
    }

    useEffect(() => {
        console.log( "read updates for", current.label, (current.isChannel && "Channel") || "DM");
        if (current.id ) {
            const unsub = onSnapshot(currentRef, (doc) => {
                const source = doc.metadata.hasPendingWrites
                    ? "Local"
                    : "Server";
                const serverData = doc.data();
                if (isValidUpdate(serverData) && source !== "Local") {
                    doUpdate(serverData);
                }
                console.log( source, (current.isChannel && "Chnldata: ") || "DMdata: ", serverData);
            });
            return () => unsub();
        }
    }, [current]);
    return null;
}

const ChannelUpdates = () => {
    const channels = useSelector((state) => state.channels);
    const updateType = useSelector((state) => state.navigation.updateType);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const setChannel = () => addModule(user, channels, "channel");

    const addMessage = () =>
        addModuleMsg(user.channelIds, channels, preChannel);

    useEffect(() => {
        if (updateType) {
            if (
                updateType === "channel" &&
                user.channelIds != preUser?.channelIds
            ) {
                setChannel();
            } else if (
                preChannel &&
                updateType === "message" &&
                channels != preChannel
            ) {
                addMessage();
            }
            dispatch(setUpdateType(null));
        }
    }, [channels]);

    return null;
};

const DMUpdates = () => {
    const dms = useSelector((state) => state.dms);
    const updateType = useSelector((state) => state.navigation.updateType);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const setDM = () => addModule(user, dms, "dm");

    const addMessage = () => addModuleMsg(user.dmIds, dms, preDM);

    useEffect(() => {
        if (updateType) {
            if (updateType === "dm" && user.dmIds != preUser?.dmIds) {
                setDM();
            } else if (preDM && updateType === "message" && dms != preDM) {
                addMessage();
            }
            dispatch(setUpdateType(null));
        }
    }, [dms]);

    return null;
};

const addModule = (user, module, type) => {
    const ids = type != "dm" ? user.channelIds : user.dmIds;
    const id = lastElement(ids);
    const mod = module[id];
    console.log("new channel was added: ", mod);
    if (type == "dm") {
        id && AddOrSetDM(id, mod);
    } else {
        id && AddOrSetChannel(id, mod);
    }
    id && AddOrSetUser(user);
};

const addModuleMsg = (ids, module, preModule) => {
    for (let id of ids) {
        let mod = module[id];
        let preMod = preModule[id];
        if (mod.msgIds != preMod?.msgIds) {
            const mid = lastElement(mod.msgIds);
            const type = mod?.title ? "channel" : "dm";
            if (type != "dm") {
                mid && AddOrSetChannel(id, mod);
            } else mid && AddOrSetDM(id, mod);
            console.log(type + " message was updated at", mid);
            break;
        }
    }
};

export default RealTimeUpdater;
