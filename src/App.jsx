import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";

const App = () => {
    const darkMode = useSelector((state) => state.navigation.darkMode);
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: purple[100],
                light: purple[800],
            },
        },
    });
    const lightTheme = createTheme({
        palette: {
            mode: "light",
            primary: {
                main: purple[500],
                light: purple[100],
            },
        },
        // components: {
        //     MuiListItem: {
        //         styleOverrides: {
        //             root: {
        //                 ".Mui-selected": {
        //                     background: purple[500],
        //                 },
        //             },
        //         },
        //     },
        // },
    });
    // create routes for welcome and home pages
    const router = createBrowserRouter([
        { path: "/", element: <Welcome /> },
        { path: "/Home", element: <Home /> },
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
