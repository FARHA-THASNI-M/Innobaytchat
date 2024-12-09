import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import * as thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import mainReducers from "../Main";

const persistConfig = {
  key: "root",
  storage
};

const middleware = [thunk.thunk];
const rootReducer = combineReducers({
  mainReducers,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
  persistedReducer,
  compose(
    applyMiddleware(...middleware),
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f
  )
);
export const persistor = persistStore(store);
export default store;
