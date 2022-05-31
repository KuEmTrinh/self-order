import React from "react";
import "./FoodEdit.css";
import { db } from "../../../../app/firebase";
import { useState, useEffect } from "react";
export default function FoodEdit(props) {
  const editFood = JSON.parse(props.food);
  const editThisFood = () => {
    const query = db
      .collection("category")
      .doc(props.categoryId)
      .collection("food")
      .doc(editFood.id);
    const update = query.update({
      vietnamese: foodVietnamese,
      japanese: foodJapanese,
      price: foodPrice,
    });
    props.onClose();
    return update;
  };
  useEffect(() => {
    setFoodVietnamese(editFood.vietnamese);
    setFoodJapanese(editFood.japanese);
    setFoodPrice(editFood.price);
  }, []);
  const [foodVietnamese, setFoodVietnamese] = useState("");
  const [foodJapanese, setFoodJapanese] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const foodVietnameseChangeValue = (e) => {
    setFoodVietnamese(e.target.value);
  };
  const foodJapaneseChangeValue = (e) => {
    setFoodJapanese(e.target.value);
  };
  const foodPriceChangeValue = (e) => {
    setFoodPrice(e.target.value);
  };
  return (
    <div className="foodEdit">
      <div className="foodImage">
        <img src={editFood.imgUrl} />
      </div>
      <div className="foodContent w-100">
        <div className="foodDetail flex flex-column">
          <input
            className="inputBoxEnter"
            value={foodVietnamese}
            onChange={foodVietnameseChangeValue}
          />
          <input
            className="inputBoxEnter mt-1"
            onChange={foodJapaneseChangeValue}
            value={foodJapanese}
          />
          <input
            className="inputBoxEnter mt-1"
            onChange={foodPriceChangeValue}
            value={foodPrice}
          />
        </div>
        <button className="foodButton" onClick={editThisFood}>
          Sửa
        </button>
      </div>
    </div>
  );
}
