import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { updateRegime } from "../services/RegimesActions";

export default function DisplayRegimes({ lang }) {
  const dispatch = useDispatch();
  const config = useSelector(
    (state) => state.configurationReducer.configuration,
    shallowEqual
  );
  const regimesConfig = config.regimes;
  const regimesReducer = useSelector(
    (state) => state.regimesReducer,
    shallowEqual
  );
  const regimesList = regimesReducer.list;
  // console.log("default: ", regimesReducer.selected);
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="radio-buttons"
        name="radio-buttons-group"
        defaultValue={regimesReducer.selected}
        onChange={(event) => {
          dispatch(updateRegime(event.target.value));
        }}
      >
        {regimesList &&
          regimesList.map((regimeReducer, index) => {
            const regimeConfig = regimesConfig.filter(
              (regime) => regime.code === regimeReducer.code
            );
            const regimeColor = regimeConfig[0].color;
            const regimeText = regimeConfig[0].label[lang];
            // console.log("individual: ", regimeReducer.rowid);

            return (
              <FormControlLabel
                index={index}
                value={regimeReducer.rowid}
                control={
                  <Radio
                    sx={{
                      color: "grey.400", // default color
                      "&.Mui-checked": {
                        color: regimeColor,
                      },
                    }}
                  />
                }
                label={regimeText}
                style={{
                  color: regimeColor,
                  height: "25px",
                }}
              />
            );
          })}
      </RadioGroup>
    </FormControl>
  );
}