import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from '../features/counter/counterSlice';
// Import Reducer
import ConfigurationReducer from "../services/ConfigurationReducer";
import LoginReducer from "../services/LoginReducer";
export const store = configureStore({
  reducer: {
    configurationReducer: ConfigurationReducer,
    loginReducer: LoginReducer,
  },
});
