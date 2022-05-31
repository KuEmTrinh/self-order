import React from "react";
import "./Payment.css";
export default function Payment({priceTotal}) {
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
      <div className="paymentConfirmButton">Thanh toán</div>
    </div>
  );
}
