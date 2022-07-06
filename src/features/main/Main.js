import React from "react";
import { Routes, Route } from "react-router-dom";
import Order from "./component/order/Order";
import Menu from "./component/menu/Menu";
import Table from "./component/table/Table";
import Food from "./component/menu/Food";
import Bill from "./component/bill/Bill";
import Payment from "./component/payment/Payment";
import Setting from "./component/setting/Setting";
import "./Main.css";
export default function Main() {
  return (
    <div className="main">
      <div className="mainComponent">
        <Routes>
          <Route path="/" element={<Order />} />
          <Route path="/menu/" element={<Menu />} />
          <Route path="/menu/:id/:name" element={<Food />} />
          <Route path="/table" element={<Table />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/method" element={<Payment />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="*" element={<p>Không tìm thấy đường dẫn</p>} />
        </Routes>
      </div>
    </div>
  );
}
