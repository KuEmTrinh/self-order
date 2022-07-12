import React from "react";
import TextField from "@mui/material/TextField";

export default function TablePayment({
  tablePriceTotal,
  setInputPrice,
  setReturnPrice,
  inputPrice,
  returnPrice,
}) {
  const tablePriceTotalChange = (e) => {
    let returnPrice = 0;
    returnPrice = e.target.value - tablePriceTotal;
    setInputPrice(e.target.value);
    if (returnPrice >= 0) {
      setReturnPrice(returnPrice);
    }
  };
  return (
    <div className="tablePaymentBox">
      <p className="componentTitle">In hoá đơn</p>
      <div className="tablePriceTotalBox">
        <p>{tablePriceTotal}</p>
      </div>
      <p className="tableBillSubTitle">Tổng</p>
      <div className="tableBillPriceBox">
        <div className="tableBillPriceInput">
          <TextField
            id="outlined-number"
            label="Khách trả"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              tablePriceTotalChange(e);
            }}
            value={inputPrice}
          />
        </div>
        <div className="tableBillReturnBox">
          <p className="returnPriceSubTitle">Thối lại</p>
          <p className="returnPriceCount">{returnPrice}</p>
        </div>
      </div>
      <p className="subTitleComponent">Chọn tiền</p>
      <div className="paymentMoneyBox">
        <div
          className="paymentMoneyLabel"
          onClick={() => {
            const newPrice = inputPrice + 10000;
            setInputPrice(newPrice);
          }}
        >
          10000
        </div>
        <div className="paymentMoneyLabel">5000</div>
        <div className="paymentMoneyLabel">1000</div>
        <div className="paymentMoneyLabel">500</div>
      </div>
    </div>
  );
}
