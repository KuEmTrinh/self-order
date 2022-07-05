import React, { useEffect, useState } from "react";
import { db } from "../../../../app/firebase";
import "./Categories.css";
import FoodList from "../food/FoodList";
import Search from "./Search";
export default function Categories({ data, tableId, userId, paymentStatus }) {
  useEffect(() => {
    setCategoryId(data[0].id);
  }, []);
  const [categoryId, setCategoryId] = useState("");
  const [indexCategory, setIndexCategory] = useState(0);
  const deleteBill = (tableId) => {
    const query = db
      .collection("user")
      .doc(userId)
      .collection("bill")
      .where("tableId", "==", tableId);
    query
      .where("status", "==", 1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          doc.ref.delete();
        });
      });
  };
  const changePaymentStatus = () => {
    deleteBill(tableId);
    const query = db.collection("table").doc(tableId).update({
      paymentStatus: false,
    });
  };
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
      {categoryId && paymentStatus == false ? (
        <FoodList
          categoryId={categoryId}
          paymentStatus={paymentStatus}
        ></FoodList>
      ) : (
        <div className="paymentTrue">
          <p>Đang xác nhận thanh toán</p>
          <button
            className="button button-green paymentTrueButton"
            onClick={changePaymentStatus}
          >
            Tiếp tục Gọi món
          </button>
        </div>
      )}
    </>
  );
}
