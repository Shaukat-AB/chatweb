import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import Add from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { navToggler, setUpdateType } from "../utils/navigationSlice";

const NewContentPopover = ({ anchor }) => {

    const isContentPopoverOpen = useSelector(
        (state) => state.navigation.isContentPopoverOpen
    );
    const dispatch = useDispatch()

    const addNewContent = (content) => {
        dispatch(navToggler("isContentPopoverOpen"));
        dispatch(navToggler("isFormModalOpen"));
        dispatch( setUpdateType(content) )
    }

    return (
        <Popover
            open={isContentPopoverOpen}
            component={"ul"}
            anchorEl={() => anchor()}
            onClose={() => dispatch(navToggler("isContentPopoverOpen"))}
            anchorOrigin={{vertical:"bottom", horizontal:-120}}
        >
            <ListItemButton onClick={ () => addNewContent("channel") } >
                <Add />
                <Typography mx={1} variant="body2">
                    New Channel
                </Typography>
            </ListItemButton>
            <ListItemButton onClick={ () => addNewContent("dm") } >
                <Add />
                <Typography mx={1} variant="body2">
                    New DM
                </Typography>
            </ListItemButton>
        </Popover>
    );
};

export default NewContentPopover;
