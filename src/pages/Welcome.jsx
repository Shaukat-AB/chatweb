import Signin from "../components/Signin";
import useAuthState from "../utils/useAuthState";
import {Navigate} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";

const Welcome = () => {
    const user = useAuthState()
    console.log("welcome: ", user);
    if ( user ) {
        // user is authenticated
        return <Navigate to="/Home" />;
    }
    return (
        <Container>
            <Signin>
                <CircularProgress />
            </Signin>
        </Container>
    );
}

export default Welcome