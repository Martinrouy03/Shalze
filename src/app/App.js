import React from "react";
import "../fonts.css";
import "./App.scss";

// Import libraries
import { useState, useEffect } from "react";
import { useDispatch, shallowEqual, useSelector } from "react-redux";

// Import Views
import Header from "../views/Header";
import LoginModal from "../views/LoginModal";

// Import Actions
import { getConfiguration } from "../services/ConfigurationActions";

function App() {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token") || "";

  // State instantiations:
  const navLanguage = navigator.language || navigator.userLanguage;
  let initLang = "";
  if (navLanguage.includes("fr")) {
    initLang = "FR";
  } else {
    initLang = "EN";
  }
  const [lang, setLang] = useState(initLang);

  // Selector instantiations:
  const config = useSelector(
    (state) => state.configurationReducer.configuration,
    shallowEqual
  );
  const modalClose = useSelector(
    (state) => state.loginReducer.modalClose,
    shallowEqual
  );
  const loginReducer = useSelector((state) => state.loginReducer);
  useEffect(() => {
    dispatch(getConfiguration());
  }, [config, modalClose]);
  return (
    <div>
      <Header lang={lang} setLang={setLang} initLang={initLang} token={token} />
      {!modalClose && config.language && !token && <LoginModal lang={lang} />}
      <div className="center">
        {loginReducer.error && loginReducer.error.code === "ERR_NETWORK" && (
          <h2>Serveur inopérant: contacter l'administrateur</h2>
        )}
      </div>
    </div>
  );
}

export default App;
