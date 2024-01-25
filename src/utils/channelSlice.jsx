import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "000AAA": {
        title: "public channel",
        msgIds: [],
        members: [],
        owner: { },
        member: {},
        messages: {},
    },
};

const channelSlice = createSlice({
    name: "channels",
    initialState,
    reducers: {
        // Redux Tk allows mutating logic in reducers.
        // Redux TK uses Immer library that doesn't actually mutate the state.
        addChannel: (state, action) => {
            const [id, title, current, msgIds, members, messages, member] = action.payload;
            const owner = { id: current.id, name: current.name };
            state[id] = {
                title: title,
                owner: owner,
                msgIds: msgIds || [],
                members: members || [],
                messages: messages || {},
                member: member || {},
            };
        },

        removeChannel: (state, action) => {
            let id = action.payload;
            delete state[id];
        },

        addMessage: (state, action) => {
            const [msgId, value, author, chnlId] = action.payload;
            state[chnlId].messages[msgId] = {
                text: value,
                author: {
                    id: author.id,
                    name: author.name,
                    avatarURL: author.avatarURL,
                },
            };
            state[chnlId].msgIds.push(msgId);
        },
    },
});

// Action creators are generated for each reducer function
export const { addChannel, removeChannel, addMessage } = channelSlice.actions;

export default channelSlice.reducer;
