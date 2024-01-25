import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current: { id: "000AAA", label: "public channel", isChannel: true },
    darkMode: false,
    isSideBarOpen: false,
    isFormModalOpen: false,
    isContentPopoverOpen: false,
    updateType: null, // values : "channel", "dm", "message", null
};

const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        // Redux Tk allows mutating logic in reduces.
        // Redux TK uses Immer library that doesn't actually mutate the state.
        navToggler: (state, action) => {
            const payload = action.payload;

            // if typepof payload is array and "bool" exists then make state equal to "bool" value.
            const [target, bool] = payload;
            if (
                target &&
                typeof state[target] == "boolean" &&
                typeof bool == "boolean"
            ) {
                state[target] = bool;
            } else if (payload && typeof state[payload] == "boolean") {
                state[payload] = !state[payload];
            }
        },
        setUpdateType: (state, action) => {
            state.updateType = action.payload || null;
        },
        setCurrent: (state, action) => {
            state.current = action.payload;
        },
    },
});

// Action creators are generated for each reducer function
export const { navToggler, setUpdateType, setCurrent } =
    navigationSlice.actions;

export default navigationSlice.reducer;
