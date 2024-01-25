import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // "": {
    //     msgIds: [],
    //     members: [],
    //     member: {},
    //     messages: {},
    //     },
    // },
};

const dmSlice = createSlice({
    name: "dms",
    initialState,
    reducers: {
        // Redux Tk allows mutating logic in reducers.
        // Redux TK uses Immer library that doesn't actually mutate the state.
        addDM: (state, action) => {
            const [dmid, user1, user2, msgIds, messages] = action.payload;

            state[dmid] = {
                msgIds: msgIds || [],
                messages: messages|| {},
                members: [user2.id, user1.id],
                member: {},
            };
            state[dmid].member[user2.id] = {
                name: user2.name || user2.id,
                avatarURL: user2?.avatarURL || "",
            };
            state[dmid].member[user1.id] = {
                name: user1.name,
                avatarURL: user1.avatarURL,
            };
        },

        removeDM: (state, action) => {
            let id = action.payload;
            delete state[id];
        },

        addMessage: (state, action) => {
            const [msgId, value, author, dmId] = action.payload;
            state[dmId].messages[msgId] = {
                text: value,
                author: {
                    id: author.id,
                    name: author.name,
                    avatarURL: author.avatarURL,
                },
            };
            state[dmId].msgIds.push(msgId);
        },
    },
});

// Action creators are generated for each reducer function
export const { addDM, removeDM, addMessage } = dmSlice.actions;

export default dmSlice.reducer;
