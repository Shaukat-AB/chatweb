import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import MessageSnippet from "./MessageSnippet";

const MessageContainer = () => {
    const current = useSelector((state) => state.navigation.current);
    const msgIds = useSelector((state) =>
        current.isChannel
            ? state.channels[current.id]?.msgIds
            : state.dms[current.id]?.msgIds
    );

    const messages = useSelector((state) => current.isChannel ? state.channels[current.id]?.messages : state.dms[current.id]?.messages);

    return (
        <Grid
            component={"main"}
            item
            container
            gap={3}
            md={8}
            lg={9}
            xl={11}
            mt={9}
            mb={15}
            ml={"auto"}
        >
            {msgIds?.length > 0 &&
                msgIds.map((id) => (
                    <MessageSnippet
                        key={id}
                        user={messages[id]?.author}
                        message={messages[id]?.text}
                    />
                ))}
        </Grid>
    );
};

export default MessageContainer;
