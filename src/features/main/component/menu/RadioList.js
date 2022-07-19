import React from "react";
import "./RadioList.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
export default function RadioList({ radioList }) {
  return (
    <div className="foodRadioList">
      {radioList ? (
        <>
          {radioList.map((el) => {
            return (
              <div className="radioListPreviewBox">
                <p className="radioListPreviewTitle">{el.name}</p>
                <div className="radioPreviewListItem">
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={el.list[0].name}
                    name="radio-buttons-group"
                  >
                    {el.list.map((item) => {
                      return (
                        <div className="radioListItem">
                          <FormControlLabel
                            value={item.name}
                            control={<Radio size="small" />}
                            label={item.name}
                            margin="none"
                          />
                          {item.price !== 0 ? (
                            <p className="radioPriceText">({item.price})</p>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <p className="subTitleComponent">Không có dữ liệu</p>
      )}
    </div>
  );
}
