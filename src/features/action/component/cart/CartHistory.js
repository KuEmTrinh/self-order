import React, { useState } from "react";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import AnimateHeight from "react-animate-height";
export default function CartHistory() {
  const [height, setHeight] = useState(0);
  return (
    <>
      <div className="historyCartWrap">
        <AnimateHeight
          className="cartHistoryBox"
          duration={500}
          height={height}
        >
          <div className="cartItem">
            <div className="cartImage">
              <img src="https://firebasestorage.googleapis.com/v0/b/selforder-39140.appspot.com/o/files%2Ft%C3%B4m.jfif?alt=media&token=942ca0af-a75c-43c2-a037-95b4ea90644f" />
            </div>
            <div className="cartItemRight">
              <div className="cartInfomation">
                <p className="cartVietnamese">ABC</p>
                <p className="cartJapanese">EFD</p>
                <p className="cartPrice">1231</p>
              </div>
            </div>
          </div>
        </AnimateHeight>
      </div>
      <div
        className="cartHistory"
        onClick={() => {
          setHeight(height === 0 ? "auto" : 0);
        }}
      >
        <ManageSearchIcon fontSize="large"></ManageSearchIcon>
        <p>Cac mon da goi</p>
      </div>
    </>
  );
}
