import { configureStore, combineReducers } from "@reduxjs/toolkit";
import navigationSlice from "./utils/navigationSlice";
import channelSlice from "./utils/channelSlice";
import dmSlice from "./utils/dmSlice";
import userSlice from "./utils/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: "root",
    storage,
    blacklist: ["navigation"],
};

const rootReducer = combineReducers({
    navigation: navigationSlice,
    user: userSlice,
    channels: channelSlice,
    dms: dmSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActionPaths: ["register", "rehydrate"],
            },
        }),
});

export const persistor = persistStore(store);
