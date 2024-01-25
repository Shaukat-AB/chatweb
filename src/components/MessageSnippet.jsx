import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { TextAvatar } from "./GroupedAvatar";
import { useSelector } from "react-redux";

const MessageSnippet = ({ user, message }) => {
    const currentUser = useSelector((state) => state.user.user);
    const self = currentUser?.id === user?.id;
    const direction = self ? "row-reverse" : "row";

    return (
        <>
            <Grid container gap={2.6} flexDirection={direction} >
                <Grid>
                    <TextAvatar
                        variant="rounded"
                        text={user?.name}
                        src={user?.avatarURL}
                    />
                </Grid>

                <Grid item textAlign={"left"} maxWidth={"82%"}>
                    <Typography
                        component="h5"
                        variant="subtitle"
                        textAlign={self && "Right"}
                    >
                        {user?.name}
                    </Typography>

                    <Grid
                        item
                        xs={12}
                        sx={{ overflowWrap: "anywhere" }}
                        zeroMinWidth
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                        >
                            {message}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default MessageSnippet;
