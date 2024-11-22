import React from "react";
import "../fonts.css";
import "./App.scss";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// Import Reducer
import ConfigurationReducer from "../services/ConfigurationReducer";
import DateReducer from "../services/DateReducer";
import LoginReducer from "../services/LoginReducer";
import OrderReducer from "../services/OrderReducer";
import PlacesReducer from "../services/PlacesReducer";
import RegimesReducer from "../services/RegimesReducer";
import WeekStructureReducer from "../services/WeekStructureReducer";

// Import Views
import OnePage from "../views/OnePage";
export const store = configureStore({
  reducer: {
    configurationReducer: ConfigurationReducer,
    dateReducer: DateReducer,
    loginReducer: LoginReducer,
    orderReducer: OrderReducer,
    placesReducer: PlacesReducer,
    regimesReducer: RegimesReducer,
    weekStructureReducer: WeekStructureReducer,
  },
});

function App() {
  return (
    <Provider store={store}>
      <OnePage />
    </Provider>
  );
}

export default App;
