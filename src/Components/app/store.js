import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../Redux/userSlice";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
 
const persistConfig = {
  key: 'root',
  storage,
}
 
const persistedReducer = persistReducer(persistConfig, userReducer)
 
const StoreAndPersist = () => {
    let store = configureStore({
        reducer : {
            user: persistedReducer,
        },
    });
  let persistor = persistStore(store)
  return { store, persistor }
}

export const {store,persistor} = StoreAndPersist();