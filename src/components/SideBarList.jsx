import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { TextAvatar } from "./GroupedAvatar";
import { useSelector, useDispatch } from "react-redux";
import { setCurrent } from "../utils/navigationSlice";
import { getDMName } from "../utils/stateHelpers";

const SideBarList = ({ target, type, children }) => {
    const current = useSelector((state) => state.navigation.current);
    const currentUser = useSelector((state) => state.user.user);
    const isChannel = type !== "dm";
    const dispatch = useDispatch();
    const iterable =
        (isChannel ? currentUser?.channelIds : currentUser.dmIds) || [];

    const changeActive = (id, label, isChannel) => {
        dispatch(setCurrent({ id, label, isChannel }));
    };

    const eleList = iterable.map((id) => {
        //if "target" does not have value for key "id" return.
        let module = target[id];
        if (!module) return;

        // user has valid value if isChannel false otherwise its false
        const user = !isChannel ? module : null;
        const label = isChannel
            ? module?.title
            : getDMName(user, currentUser.name)?.name;

        return (
            <ListItem key={id}>
                <ListItemButton
                    sx={{
                        borderRadius: "1.4rem",
                        padding: "3px 6px",
                        "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: "primary.select",
                        },
                    }}
                    selected={current.label === label}
                    onClick={() => changeActive(id, label, isChannel)}
                >
                    {!user ? (
                        // render "DMList" if user is valid otherwise render "ChannelList"
                        <ChannelList
                            title={label}
                            selected={current.label === label}
                        />
                    ) : (
                        <DMList
                            user={user}
                            selected={current.label === label}
                        />
                    )}
                </ListItemButton>
            </ListItem>
        );
    });

    return (
        <List sx={{ width: "250px", overflow: "hidden" }}>
            {children}
            {eleList}
        </List>
    );
};

const ChannelList = ({ title, selected }) => {
    const style = selected
        ? { fontWeight: 600, color: "primary.contrastText" }
        : { fontWeight: 400 }; // when item selected
    const t = "# " + title;
    return (
        <>
            <ListItemText sx={{ overflow: "hidden" }}>
                <Typography component={"span"} mx={1} sx={style}>
                    {t}
                </Typography>
            </ListItemText>
        </>
    );
};

const DMList = ({ user, selected }) => {
    const currentUser = useSelector((state) => state.user.user);
    const target = getDMName(user, currentUser.name);
    const name = target?.name;
    const avatar = target?.avatarURL;
    const style = selected
        ? { fontWeight: 600, color: "primary.contrastText" }
        : { fontWeight: 400 }; // when item selected

    return (
        <>
            <TextAvatar text={name} src={avatar} width={30} sx={{ mx: 1 }} />
            <ListItemText>
                <Typography component={"span"} sx={style}>
                    {name}
                </Typography>
            </ListItemText>
        </>
    );
};

export default SideBarList;
