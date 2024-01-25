import Container from "@mui/material/Container";
import SideBar from "../components/SideBar";
import MessageContainer from "../components/MessageContainer";
import Header from "../components/Header";
import MessageField from "../components/MessageField";
import useAuthState from "../utils/useAuthState";
import { useNavigate } from "react-router-dom";
import ModalTypeSelector from "../components/ModalTypeSelector";
import RealTimeUpdater from "../components/RealTimeUpdater";
import { useEffect } from "react";

const Home = () => {
    const user = useAuthState()
    const navigate = useNavigate();

    useEffect(() => {
        const sub = () => {
            if(!user){
            //user is not authenticated
            navigate("/");
            }
        }
        return () => sub();
    }, []);

    return (
        <>
            <SideBar />
            <ModalTypeSelector />
            <Container>
                <Header />
                <MessageContainer />
            </Container>
            <MessageField />
            <RealTimeUpdater />
        </>
    );
};

export default Home;
