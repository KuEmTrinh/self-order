import React from "react";
import TextField from "@mui/material/TextField";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useReactToPrint } from "react-to-print";
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
      <p className="subTitleComponent">Số dư thanh toán</p>
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
      <p className="subTitleComponent">Xác nhận thanh toán</p>
      <div className="tableBillButtonBox">
        <div className="tableBillCompleteReceipt">
          <p className="tableBillCompleteReceiptText">Hoàn thành</p>
          <div className="tableBillCompleteReceiptIcon">
            <CheckCircleIcon></CheckCircleIcon>
          </div>
        </div>
        <div className="tableBillPrintReceipt">
          <p className="tableBillPrintText">In hóa đơn</p>
          <div className="tableBillPrintIcon">
            <PrintIcon></PrintIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
