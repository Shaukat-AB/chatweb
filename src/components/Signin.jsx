import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { signinToggler } from "../utils/userSlice";
import {TextAvatar} from "./GroupedAvatar";
import google from "../assets/google.png";

const Signin = ({ children }) => {
    const dispatch = useDispatch();
    const canSignin = useSelector((state) => state.user.canSignin);
    const userState = useSelector((state) => state.user.user);

    const googleSignin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
            console.log("signin sucessful");
        } catch (e) {
            dispatch(signinToggler(false));
            console.error("sigin failed, ", e);
        }
    };

    const onSignin = () => {
        // "willSignin"serve as quick state update for "canSignin" state instead of using useEffect
        let willSignin = canSignin;
        if (userState?.id === "") {
            dispatch(signinToggler(true));
            willSignin = true;
        }
        willSignin && console.log("canSignin", willSignin);
        willSignin && googleSignin();
    };

    return (
        <Grid
            container
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"80vh"}
            gap={1}
        >
            <TextAvatar text={"GOOGLE"} width={100} sx={{mb: "1.8rem", bgcolor:"inherit"}} src={google}/>
            <Button
                variant="contained"
                onClick={() => onSignin()}
                disabled={userState?.id === "" && canSignin}
            >
                Signin using google
            </Button>
            <Grid minHeight={"80px"}>{userState?.id === "" && canSignin && children}</Grid>
        </Grid>
    );
};

export default Signin;