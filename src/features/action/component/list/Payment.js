import React, { useEffect, useState } from "react";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import "./Payment.css";
export default function Payment({
  priceTotal,
  userId,
  tableId,
  listData,
  tableName,
  totalCount,
  completeCount,
  cancelCount,
  setOpenPayment,
}) {
  console.log(listData);
  const [receiptMethod, setReceiptMethod] = useState(1);
  const [paymentData, setPaymentData] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethodIndex, setPaymentMethodIndex] = useState(0);
  const getPaymentMethodIndex = (index) => {
    setPaymentMethod(paymentData[index]);
    setPaymentMethodIndex(index);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        const query = await db
          .collection("user")
          .doc(userId)
          .collection("method")
          .orderBy("createdAt")
          .get()
          .then((snapshot) => {
            snapshot.forEach((el) => {
              data.push(el.data().name);
            });
          });
        setPaymentData(data);
        setPaymentMethod(data[0]);
        return query;
      } catch (error) {}
    };
    fetchData();
  }, []);
  const changeTablePaymentStatus = (tableId) => {
    const query = db.collection("table").doc(tableId);
    query.update({
      paymentStatus: true,
    });
  };
  const paymentConfirm = () => {
    if (paymentMethod == "") {
      setPaymentMethod(paymentMethod[0]);
    }
    console.log("confirm");
    const query = db
      .collection("user")
      .doc(userId)
      .collection("bill")
      .add({
        tableName: tableName,
        totalOrder: totalCount,
        complete: completeCount,
        cancel: cancelCount,
        tableId: tableId,
        total: priceTotal,
        details: listData,
        status: 1,
        method: paymentMethod,
        receipt: String(receiptMethod),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    changeTablePaymentStatus(tableId);
    setOpenPayment(false);
    return query;
  };
  return (
    <div className="payment">
      <p className="paymentTitle">X??c nh???n Thanh To??n</p>
      <div className="paymentTotal">
        <p className="paymentPrice">{priceTotal}</p>
        <p className="paymentTax">G???m thu???</p>
      </div>
      <div className="paymentMethod">
        <p className="paymentMethodTitle">Ph????ng th???c thanh to??n</p>
        <div className="paymentMethodBox">
          {paymentData ? (
            <>
              {paymentData.map((el, index) => {
                return (
                  <p
                    className={
                      paymentMethodIndex == index
                        ? "paymentMethodItem paymentMethodItemActive"
                        : "paymentMethodItem"
                    }
                    onClick={() => {
                      getPaymentMethodIndex(index);
                    }}
                  >
                    {el}
                  </p>
                );
              })}
            </>
          ) : (
            "Loading"
          )}
          {/* <p className="paymentMethodItem paymentMethodItemActive">Ti???n M???t</p>
          <p className="paymentMethodItem">Ti???n M???t</p>
          <p className="paymentMethodItem">Ti???n M???t</p>
          <p className="paymentMethodItem">Ti???n M???t</p> */}
        </div>
        <p className="paymentMethodTitle">Ho?? ????n</p>
        <div className="paymentMethodBox">
          <p
            className={
              receiptMethod == 1
                ? "paymentMethodItem paymentMethodItemActive"
                : "paymentMethodItem"
            }
            onClick={() => {
              setReceiptMethod(1);
            }}
          >
            C??
          </p>
          <p
            className={
              receiptMethod == 2
                ? "paymentMethodItem paymentMethodItemActive"
                : "paymentMethodItem"
            }
            onClick={() => {
              setReceiptMethod(2);
            }}
          >
            Kh??ng
          </p>
        </div>
      </div>
      <div className="paymentConfirmButton" onClick={paymentConfirm}>
        Thanh to??n
      </div>
    </div>
  );
}
