import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";

const App = () => {

    const darkMode = useSelector((state) => state.navigation.darkMode);
    const darkTheme = createTheme({
        palette: { mode: "dark" },
    });
    const lightTheme = createTheme({
        palette: { mode: "light" },
    });

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Welcome />,
        },
        {
            path: "/Home",
            element: <Home />,
        },
    ]);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <PersistGate loading={null} persistor={persistor}>
                <RouterProvider router={router} />
            </PersistGate>
        </ThemeProvider>
    );
};

export default App;
