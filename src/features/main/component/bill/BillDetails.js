import React, { useRef } from "react";
import { db } from "../../../../app/firebase";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useReactToPrint } from "react-to-print";
import { green } from "@mui/material/colors";
export default function BillDetails({ onClose, bill, userId }) {
  const componentRef = useRef();
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
      });
    return query;
  };
  const resetList = () => {
    const query = db.collection("user").doc(userId).collection("order");
    query
      .where("tableId", "==", bill.tableId)
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
  const completeBill = () => {
    const query = db
      .collection("user")
      .doc(userId)
      .collection("bill")
      .doc(bill.id)
      .update({
        status: 2,
      });
    randomCodeTable(bill.tableId);
    onClose();
    resetList();
    return query;
  };
  const RenderComponent = React.forwardRef((props, ref) => {
    return (
      <div className="billDetail">
        <div className="billPrintContent">
          <div ref={ref} className="billPrintContentCenter">
            <p className="billDetailTitle">
              Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi
            </p>

            <p className="billDetailTable">{props.bill.tableName}</p>
            <div className="billDetailProductWrap">
              <p>Tổng món:</p>
              <p>{props.bill.totalOrder}</p>
            </div>
            <div className="billDetailProductWrap">
              <p>Hoàn thành:</p>
              <p>{props.bill.complete}</p>
            </div>
            <div className="billDetailProductWrap">
              <p>Huỷ:</p>
              <p>{props.bill.cancel}</p>
            </div>
            <div className="billDetailProductWrap">
              <p>Phương thức:</p>
              <p>{props.bill.method}</p>
            </div>
            <hr></hr>
            <p className="billDetailText">Chi tiết</p>
            <div className="billDetailProduct">
              {props.bill.details.map((el, index) => {
                return (
                  <div className="billDetailProductWrap" key={index}>
                    <p>
                      {el.count} {el.vietnamese}
                    </p>
                    <p>{el.newPrice}</p>
                  </div>
                );
              })}
            </div>
            <hr></hr>
            <div className="billDetailTotal">
              <p>Tổng</p>
              <p>{props.bill.total}</p>
            </div>
          </div>
        </div>
      </div>
    );
  });
  return (
    <>
      <RenderComponent ref={componentRef} bill={bill} />
      <div className="billDetailButton">
        {bill.status == 1 ? (
          <button className="billDetailButtonCheck" onClick={completeBill}>
            <p>Xong</p> <CheckCircleIcon color="action"></CheckCircleIcon>
          </button>
        ) : (
          <button className="billDetailButtonCheck">
            <CheckCircleIcon sx={{ color: green[500] }}></CheckCircleIcon>
          </button>
        )}

        <button className="billDetailButtonPrint" onClick={handlePrint}>
          <p>In</p> <PrintIcon color="action"></PrintIcon>
        </button>
      </div>
    </>
  );
}
