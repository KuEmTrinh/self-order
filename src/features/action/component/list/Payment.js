import React, { useEffect, useState } from "react";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import "./Payment.css";
export default function Payment({
  priceTotal,
  userId,
  tableId,
  listData,
  resetList,
  tableName,
  totalCount,
  completeCount,
  cancelCount,
}) {
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
      setPaymentMethod([data[0]]);
      return query;
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
    resetList();
    return query;
  };
  return (
    <div className="payment">
      <p className="paymentTitle">Xác nhận Thanh Toán</p>
      <div className="paymentTotal">
        <p className="paymentPrice">{priceTotal}</p>
        <p className="paymentTax">Gồm thuế</p>
      </div>
      <div className="paymentMethod">
        <p className="paymentMethodTitle">Phương thức thanh toán</p>
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
          {/* <p className="paymentMethodItem paymentMethodItemActive">Tiền Mặt</p>
          <p className="paymentMethodItem">Tiền Mặt</p>
          <p className="paymentMethodItem">Tiền Mặt</p>
          <p className="paymentMethodItem">Tiền Mặt</p> */}
        </div>
        <p className="paymentMethodTitle">Hoá đơn</p>
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
            Có
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
            Không
          </p>
        </div>
      </div>
      <div className="paymentConfirmButton" onClick={paymentConfirm}>
        Thanh toán
      </div>
    </div>
  );
}
