import GroupedAvatar from "./GroupedAvatar";
import NewContentPopover from "./NewContentPopover";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MenuSharp from "@mui/icons-material/MenuSharp";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import LightMode from "@mui/icons-material/LightMode";
import Add from "@mui/icons-material/Add";
import DarkMode from "@mui/icons-material/DarkMode";
import { useSelector, useDispatch } from "react-redux";
import { navToggler } from "../utils/navigationSlice";
import { useRef } from "react";

const Header = () => {
    const current = useSelector((state) => state.navigation.current);
    const darkMode = useSelector((state) => state.navigation.darkMode);
    const members = useSelector(
        (state) => current.isChannel && state.channels[current.id]?.members
    );
    const anchorRef = useRef(null);
    const dispatch = useDispatch();
    const mdScreen = useMediaQuery("(min-width:900px)");
    const smScreen = useMediaQuery("(min-width:460px)");

    return (
        <AppBar
            component="header"
            sx={{
                bgcolor: "primary.contrastText",
                color: "text.secondary",
            }}
        >
            <Container>
                <Grid
                    item
                    container
                    alignItems={"center"}
                    gap={1.5}
                    md={8}
                    lg={9}
                    xl={11}
                    ml={"auto"}
                    minHeight={"52px"}
                >
                    {!mdScreen && (
                        <IconButton
                            onClick={() =>
                                dispatch(navToggler("isSideBarOpen"))
                            }
                            aria-label="Toggle Open/Close Side bar"
                            sx={{ padding: "0px" }}
                        >
                            <MenuSharp></MenuSharp>
                        </IconButton>
                    )}

                    <Grid item xs={5} mr={"auto"}>
                        <Typography
                            component={"h4"}
                            variant="body"
                            color="text.primary"
                            sx={{ cursor: "pointer" }}
                            overflow={"hidden"}
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                            maxWidth={"100%"}
                            title={current.label}
                        >
                            {current.label}
                        </Typography>
                    </Grid>

                    {members?.length > 0 && smScreen && (
                        <BoxItem>
                            <GroupedAvatar />
                        </BoxItem>
                    )}

                    <BoxItem>
                        <IconButton
                            onClick={() => dispatch(navToggler("darkMode"))}
                            aria-label="Toggle Drak/Light Mode"
                            sx={{ padding: "0px" }}
                        >
                            {darkMode ? <DarkMode /> : <LightMode />}
                        </IconButton>
                    </BoxItem>

                    <BoxItem boxProps={{ ref: anchorRef }}>
                        <IconButton
                            onClick={() =>
                                dispatch(navToggler("isContentPopoverOpen"))
                            }
                            aria-label="new channel/message"
                            color="primary"
                            sx={{ padding: "0px" }}
                        >
                            <Add />
                        </IconButton>
                    </BoxItem>
                </Grid>
            </Container>
            
            <NewContentPopover anchor={() => anchorRef.current}/>
        </AppBar>
    );
};

const BoxItem = ({ children, boxProps = {} }) => {

    return (
        <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            fontSize="small"
            boxShadow={1}
            gap={0.5}
            p={0.5}
            {...boxProps}
        >
            {children}
        </Box>
    );
};

export default Header;
