import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Send from "@mui/icons-material/Send";
import getRandString from "../utils/getRandString";
import { useDispatch, useSelector } from "react-redux";
import { addMessage as addCMsg } from "../utils/channelSlice";
import { addMessage as addDMsg } from "../utils/dmSlice";
import { setUpdateType } from "../utils/navigationSlice";
import { useRef } from "react";

const MessageField = () => {
    const TextFieldRef = useRef(null);
    const dispatch = useDispatch();
    const current = useSelector((state) => state.navigation.current);
    const user = useSelector((state) => state.user.user);

    const changeMsg = () => {
        const value = TextFieldRef.current.value;
        const id = getRandString("msg");
        current.isChannel && dispatch(addCMsg([id, value, user, current.id]));
        !current.isChannel && dispatch(addDMsg([id, value, user, current.id]));
        TextFieldRef.current.value = "";
        dispatch(setUpdateType("message"));
    };

    return (
        current.id && (
            <Grid
                container
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                    position: "fixed",
                    left: "0px",
                    bottom: "0px",
                }}
                p={2}
            >
                <Grid item xs={12} md={12} lg={11} xl={9} mx="auto" maxWidth={"1200px"} >
                    <Grid item xs={12} md={8} lg={9} xl={11} ml={"auto"} bgcolor={"primary.contrastText"}>
                        <TextField
                            multiline
                            maxRows={4}
                            InputProps={{
                                inputRef: TextFieldRef,
                                endAdornment: (
                                    <IconButton onClick={() => changeMsg()}>
                                        <Send />
                                    </IconButton>
                                ),
                            }}
                            inputProps={{
                                maxLength: 300,
                            }}
                            placeholder={"Message " + current.label}
                            fullWidth
                        ></TextField>
                    </Grid>
                </Grid>
            </Grid>
        )
    );
};

export default MessageField;
