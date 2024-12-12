import { useSelector } from "react-redux";

const ErrorMessages = ({ lang }) => {
  const loginReducer = useSelector((state) => state.loginReducer);
  const regimesReducer = useSelector((state) => state.regimesReducer);
  const placesReducer = useSelector((state) => state.placesReducer);
  const orderReducer = useSelector((state) => state.orderReducer);
  const config = useSelector(
    (state) => state.configurationReducer.configuration
  );
  return (
    <div className="center">
      {((loginReducer.error && loginReducer.error.code === "ERR_NETWORK") ||
        (regimesReducer.error && regimesReducer.error.code === "ERR_NETWORK") ||
        (placesReducer.error && placesReducer.error.code === "ERR_NETWORK") ||
        (orderReducer.error && orderReducer.error.code === "ERR_NETWORK")) && (
        <h2>{config.language[lang].serverOff}</h2>
      )}
      {/* { && (
        <h2>{config.language[lang].serverOff}</h2>
      )}
      { && (
        <h2>{config.language[lang].serverOff}</h2>
      )} */}
      {loginReducer.error && loginReducer.error === 202 && (
        <h2>{config.language[lang].status202}</h2>
      )}
      {loginReducer.error && loginReducer.error === 404 && (
        <h2>{config.language[lang].userNotFound}</h2>
      )}
      {orderReducer.error && orderReducer.error.status === 404 && (
        <h2>{config.language[lang].orderNotFound}</h2>
      )}
    </div>
  );
};

export default ErrorMessages;
