import React, { useEffect, useState } from "react";
import "./Categories.css";
import FoodList from "../food/FoodList";
import Search from "./Search";
export default function Categories({ data, tableId, userId, paymentStatus }) {
  useEffect(() => {
    setCategoryId(data[0].id);
  }, []);
  const [categoryId, setCategoryId] = useState("");
  const [indexCategory, setIndexCategory] = useState(0);
  return (
    <>
      <div className="wrapTopBox">
        <div className="categoryBox">
          {data.map((element, index) => {
            return (
              <div
                className={
                  indexCategory == index
                    ? "categoryLabel active"
                    : "categoryLabel"
                }
                key={element.id}
                onClick={() => {
                  setCategoryId(element.id);
                  setIndexCategory(index);
                }}
              >
                {element.name}
              </div>
            );
          })}
        </div>
        <Search
          categoryList={data}
          categoryId={categoryId}
          tableId={tableId}
          userId={userId}
        ></Search>
      </div>
      {categoryId && paymentStatus == false ? <FoodList categoryId={categoryId} paymentStatus={paymentStatus}></FoodList> : <p className="paymentTrue">Đang xác nhận thanh toán</p>}
    </>
  );
}
