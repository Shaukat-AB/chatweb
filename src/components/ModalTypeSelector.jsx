import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { navToggler } from "../utils/navigationSlice";
import { updateModal } from "../utils/userSlice";
import { addChannel } from "../utils/channelSlice";
import { addDM } from "../utils/dmSlice";
import { useRef } from "react";
import FormModal from "./FormModal";
import getRandString from "../utils/getRandString";
import { checkUserId, AddOrSetUser } from "../utils/storeHelpers";
import { dmExists, channelExists } from "../utils/stateHelpers";

const ModalTypeSelector = () => {
    const isOpen = useSelector((state) => state.navigation.isFormModalOpen);
    const user = useSelector((state) => state.user.user);
    const dms = useSelector((state) => state.dms);
    const channels = useSelector((state) => state.channels);
    const type = useSelector((state) => state.navigation.updateType);
    const dispatch = useDispatch();
    const textRef = useRef(null);

    const onClose = () => dispatch(navToggler("isFormModalOpen"));

    const onSubmit = async (e) => {
        e.preventDefault();
        const input = textRef.current.querySelector("input");
        const value = input.value.toLowerCase();
        let success = false;
        if (value === user.id) return;
        success = await typeSelector(value, user);
        if (!success) return;
        input.value = "";
        onClose()
    };

    const typeSelector = async (value, user) => {
        // depending on value of "type" state, determine success from "onChannel" or "onDM" these functions return boolean values.
        const typeChnl = type && type === "channel";
        const typeDM = type && type === "dm";
        let success = false;
        if (typeChnl) {
            success = onChannel(value, user);
        } else if (typeDM) {
            success = await onDM(value, user);
        }
        return success;
    };

    const onDM = async (value, user) => {
        //check if dm already exists return false in that case.
        if (dmExists( value, user.dmIds, dms)) return false;
        //check if a user exists in firebase store with current "value", otherwise return false.
        const validUser = await checkUserId(value);
        if (!validUser) return false;
        const dmid = getRandString("dm");
        const user2 = {id: value, ...validUser};
        dispatch(addDM([dmid, user, user2 ]));
        dispatch(updateModal(["dmIds", dmid]));
        // update dmIds of User with "value" which serves as user id.
        const dmUser = { id: value, ...validUser };
        dmUser.dmIds.push(dmid);
        await AddOrSetUser(dmUser);
        return true;
    };

    const onChannel = (value, user) => {
        //check if channel already exists return false in that case.
        if (channelExists(value, user.channelIds, channels)) return false;
        const id = getRandString("ch");
        dispatch(addChannel([id, value, user]));
        dispatch(updateModal(["channelIds", id]));
        return true;
    };

    return (
        <FormModal isOpen={isOpen} onSubmit={onSubmit} onClose={onClose}>
            <Input
                ref={textRef}
                type={type !== "dm" ? "text" : "email"}
                placeholder={
                    type !== "dm" ? "New Channel's Title" : "New DM's Email"
                }
                fullWidth
                required
                inputProps={{
                    maxLength: 30,
                    minLength: type !== "dm" ? 3 : 10,
                }}
            />
            <Button variant="contained" type="submit" disabled={type == null}>
                {type !== "dm" ? "Add Channel" : "Add DM"}
            </Button>
            <Button
                variant="outlined"
                onClick={() => onClose()}
            >
                Cancel
            </Button>
        </FormModal>
    );
};

export default ModalTypeSelector;
