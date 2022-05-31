import React from "react";
import { Routes, Route } from "react-router-dom";
import Order from "./component/order/Order";
import Menu from "./component/menu/Menu";
import Table from "./component/table/Table";
import Food from "./component/menu/Food"
import "./Main.css";
export default function Main() {
  return (
    <div className="main w-80per">
      <div className="mainComponent">
        <Routes>
          <Route path="/order" element={<Order />} />
          <Route path="/menu/" element={<Menu />} />
          <Route path="/menu/:id/:name" element={<Food />} />
          <Route path="/table" element={<Table />} />
          {/* <Route path="/bill" element={<About />} />
        <Route path="/money" element={<About />} />
        <Route path="/printer" element={<About />} /> */}
          <Route path="*" element={<p>Cant not found router link</p>} />
        </Routes>
      </div>
    </div>
  );
}
