import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: { id: "", name: "", avatarURL: "", channelIds: [], dmIds: [] },
    canSignin: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Redux Tk allows mutating logic in reduces.
        // Redux TK uses Immer library that doesn't actually mutate the state.
        setUser: (state, action) => {
            if (action.payload === "initial") {
                state.user = initialState.user;
                return;
            }
            const [id, name, avatarURL, channelIds, dmIds] = action.payload;
            state.user = {
                id: id,
                name: name,
                avatarURL: avatarURL || "",
                channelIds: channelIds || [],
                dmIds: dmIds || [],
            };
        },

        updateModal: (state, action) => {
            const [type, value] = action.payload;
            if (type == "channelIds" || type == "dmIds") {
                state.user[type].push(value);
            }
        },

        signinToggler: (state, action) => {
            const payload = action.payload;

            // if typeof payload is "boolean".
            if (typeof payload == "boolean") {
                state.canSignin = payload;
            } else {
                state.canSignin = !state.canSignin;
            }
        },
    },
});

// Action creators are generated for each reducer function
export const { setUser, updateModal, signinToggler } = userSlice.actions;

export default userSlice.reducer;
