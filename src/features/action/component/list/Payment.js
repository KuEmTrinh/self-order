import React from "react";
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
  const paymentConfirm = () => {
    console.log("confirm");
    const query = db.collection("user").doc(userId).collection("bill").add({
      tableName: tableName,
      totalOrder: totalCount,
      complete: completeCount,
      cancel: cancelCount,
      tableId: tableId,
      total: priceTotal,
      details: listData,
      status: 1,
      method: "Tiền mặt",
      receipt: 1,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
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
          <p className="paymentMethodItem paymentMethodItemActive">Tiền Mặt</p>
          <p className="paymentMethodItem">Tiền Mặt</p>
          <p className="paymentMethodItem">Tiền Mặt</p>
          <p className="paymentMethodItem">Tiền Mặt</p>
        </div>
        <p className="paymentMethodTitle">Hoá đơn</p>
        <div className="paymentMethodBox">
          <p className="paymentMethodItem paymentMethodItemActive">Có</p>
          <p className="paymentMethodItem">Không</p>
        </div>
      </div>
      <div className="paymentConfirmButton" onClick={paymentConfirm}>
        Thanh toán
      </div>
    </div>
  );
}
