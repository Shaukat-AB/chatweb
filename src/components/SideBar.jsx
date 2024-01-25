import Drawer from "@mui/material/Drawer";
import ListSubheader from "@mui/material/ListSubheader";
import SideBarList from "./SideBarList";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { navToggler } from "../utils/navigationSlice";
import { signinToggler, setUser } from "../utils/userSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import { auth } from "../firebase";
import {useNavigate} from "react-router-dom";

const SideBar = () => {
    const isSideBarOpen = useSelector(
        (state) => state.navigation.isSideBarOpen
    );

    const user = useSelector((state) => state.user.user);
    const channels = useSelector((state) => state.channels);
    const directMessages = useSelector((state) => state.dms);
    const mdScreen = useMediaQuery("(min-width:900px)");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSignOut = async () => {
        await auth.signOut();
        dispatch(signinToggler(false));
        dispatch(setUser("initial"));
        navigate("/");
    };

    return (
        <Drawer
            variant={mdScreen ? "permanent" : "temporary"}
            anchor="left"
            open={isSideBarOpen}
            onClose={() => dispatch(navToggler("isSideBarOpen"))}
        >
            <Grid container p={2} gap={5}>
                <Typography variant="h6">{user.name}</Typography>
                <Button
                    variant="outlined"
                    sx={{ fontSize: "small" }}
                    onClick={() => onSignOut()}
                >
                    SignOut
                </Button>
            </Grid>

            <Divider></Divider>

            <SideBarList target={channels} type={"channel"}>
                <ListSubheader>Channels</ListSubheader>
            </SideBarList>

            <SideBarList target={directMessages} type={"dm"}>
                <ListSubheader>Direct messages</ListSubheader>
            </SideBarList>
        </Drawer>
    );
};

export default SideBar;
