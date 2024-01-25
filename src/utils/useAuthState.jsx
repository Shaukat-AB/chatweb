import { useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { signinToggler, setUser } from "./userSlice";
import {
    AddOrSetUser,
    checkUserId,
    AddOrSetChannel,
} from "./storeHelpers";

const useAuthState = () => {
    const currentUser = useSelector((state) => state.user.user);
    const channels = useSelector((state) => state.channels);
    const canSignin = useSelector((state) => state.user.canSignin);
    const dispatch = useDispatch();

    const signinHelper = async (user) => {
        console.log("signinHelper", user.email && canSignin, canSignin);
        const addState = {
            id: user.email,
            name: user.displayName,
            avatarURL: user.photoURL,
            channelIds: ["000AAA"],
            dmIds: [],
        };
        if (user.email && canSignin) {
            const userValid = await checkUserId(user.email);
            if (userValid) {
                const userState = [user.email, userValid.name, userValid.avatarURL, userValid.channelIds, userValid.dmIds];
                dispatch(setUser(userState));
                return;
            } else await setNewUser(addState);
        }
        dispatch(signinToggler(false));
        currentUser?.id == "" && dispatch( setUser([user.email, user.displayName, user.photoURL, [], []]));
    };

    const setNewUser = async (uState) => {
        await AddOrSetUser(uState);
        const newChannel = {...channels["000AAA"]};
        newChannel.members = [uState.id];
        const member = {}
        member[uState.id] = {
            name: uState.name,
            avatarURL: uState.avatarURL,
        };
        newChannel.member = member;
        await AddOrSetChannel("000AAA", newChannel);
    };

    useEffect(() => {
        const listener = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await signinHelper(user);
            }
        });

        return () => listener();
    }, []);

    return currentUser && currentUser?.id !== "" ? currentUser : null;
};

export default useAuthState;
