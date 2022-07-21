import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useReactToPrint } from "react-to-print";
import { firebase } from "../../../../app/firebase";
import { db } from "../../../../app/firebase";
export default function TablePayment({
  tablePriceTotal,
  setInputPrice,
  setReturnPrice,
  inputPrice,
  returnPrice,
  orderData,
  tableName,
  tableFoodTotal,
  tableFoodCancel,
  tableFoodComplete,
  tableId,
  uid,
  setPaymentToggle,
}) {
  const componentRef = useRef();
  const tablePriceTotalChange = (e) => {
    let returnPrice = 0;
    returnPrice = e.target.value - tablePriceTotal;
    setInputPrice(e.target.value);
    if (returnPrice >= 0) {
      setReturnPrice(returnPrice);
    }
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max + 1);
  };
  const randomCodeTable = (tableId) => {
    const query = db
      .collection("table")
      .doc(tableId)
      .update({
        code: getRandomInt(10000),
        paymentStatus: false,
        useStatus: false,
      });
    return query;
  };
  const resetList = () => {
    const query = db.collection("user").doc(uid).collection("order");
    query
      .where("tableId", "==", tableId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          const docChangeInfo = query
            .doc(doc.id)
            .collection("changeInfo")
            .get()
            .then((querySnapshot) => {
              try {
                querySnapshot.docs.map((doc) => {
                  doc.ref.delete();
                });
              } catch (error) {
                console.log("have no info");
              }
            });
          doc.ref.delete();
        });
      });
  };
  const paymentConfirm = () => {
    console.log("confirm");
    const query = db.collection("user").doc(uid).collection("bill").add({
      tableName: tableName,
      totalOrder: tableFoodTotal,
      complete: tableFoodComplete,
      cancel: tableFoodCancel,
      tableId: tableId,
      total: tablePriceTotal,
      details: orderData,
      status: 2,
      method: "Thanh toán tại quầy",
      receipt: 1,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    changeTablePaymentStatus(tableId);
    randomCodeTable(tableId);
    resetList();
    setPaymentToggle(false);
    return query;
  };
  const changeTablePaymentStatus = (tableId) => {
    const query = db.collection("table").doc(tableId);
    query.update({
      paymentStatus: true,
    });
  };
  const RenderComponent = React.forwardRef((props, ref) => {
    return (
      <div className="billDetail">
        <div className="billPrintContent">
          <div ref={ref} className="billPrintContentCenter">
            <p className="billDetailTitle">
              Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi
            </p>

            <p className="billDetailTable">{tableName}</p>
            <div className="billDetailProductWrap">
              <p>Tổng món:</p>
              <p>{tableFoodTotal}</p>
            </div>
            <div className="billDetailProductWrap">
              <p>Hoàn thành:</p>
              <p>{tableFoodComplete}</p>
            </div>
            <div className="billDetailProductWrap">
              <p>Huỷ:</p>
              <p>{tableFoodCancel}</p>
            </div>
            {/* <div className="billDetailProductWrap">
              <p>Phương thức:</p>
              <p>{props.bill.method}</p>
            </div> */}
            <hr></hr>
            <p className="billDetailText">Chi tiết</p>
            <div className="billDetailProduct">
              {props.orderData.map((el, index) => {
                return (
                  <>
                    {el.status != 3 ? (
                      <div className="billDetailProductWrap" key={index}>
                        <p>
                          {el.count} {el.vietnamese}
                        </p>
                        <p>{el.newPrice}</p>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                );
              })}
            </div>
            <hr></hr>
            <div className="billDetailTotal">
              <p>Tổng</p>
              <p>{tablePriceTotal}</p>
            </div>
          </div>
        </div>
      </div>
    );
  });
  return (
    <div className="tablePaymentBox">
      <div className="hiddenBox">
        <RenderComponent ref={componentRef} orderData={orderData} />
      </div>
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
        <div
          className="tableBillCompleteReceipt"
          onClick={() => {
            paymentConfirm();
          }}
        >
          <p className="tableBillCompleteReceiptText">Hoàn thành</p>
          <div className="tableBillCompleteReceiptIcon">
            <CheckCircleIcon></CheckCircleIcon>
          </div>
        </div>
        <div className="tableBillPrintReceipt" onClick={handlePrint}>
          <p className="tableBillPrintText">In hóa đơn</p>
          <div className="tableBillPrintIcon">
            <PrintIcon></PrintIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
