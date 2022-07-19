import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
export default function CheckboxList({ checkboxList }) {
  return (
    <div className="checkboxListPreview">
      <p className="radioListPreviewTitle">Khác</p>
      {checkboxList ? (
        <>
          {checkboxList.map((el) => {
            return (
              <div className="radioListItem">
                <FormControlLabel control={<Checkbox />} label={el.name} />
                {el.price !== 0 ? (
                  <p className="radioPriceText">({el.price})</p>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
