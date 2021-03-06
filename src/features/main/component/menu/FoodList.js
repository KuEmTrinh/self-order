import React from "react";
import "./Food.css";
import { db } from "../../../../app/firebase";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import FoodEdit from "./FoodEdit";
import Switch from "@mui/material/Switch";
export default function FoodList({ categoryId }) {
  const [foods, setFoods] = useState("");
  const [foodEditToggle, setFoodEditToglle] = useState(false);
  const [editFoodIndex, setEditFoodIndex] = useState("");
  const editThisFood = (index) => {
    setFoodEditToglle(!foodEditToggle);
    setEditFoodIndex(index);
  };
  const handleChangeStatus = (id, checked) => {
    const query = db
      .collection("category")
      .doc(categoryId)
      .collection("food")
      .doc(id)
      .update({
        status: !checked,
      });
    return query;
  };
  useEffect(() => {
    const query = db.collection("category").doc(categoryId).collection("food");

    const observer = query.onSnapshot((querySnapshot) => {
      const foods = [];
      querySnapshot.docs.map((doc) => {
        foods.push({
          id: doc.id,
          vietnamese: doc.data().vietnamese,
          japanese: doc.data().japanese,
          price: doc.data().price,
          imgUrl: doc.data().imgUrl,
          status: doc.data().status,
          properties: doc.data().properties,
          checkbox: doc.data().checkbox,
          createAt: doc.data().createAt,
        });
      });
      setFoods(foods);
    });
    return observer;
  }, []);
  return (
    <div className="mt-1 flex foods">
      <Modal
        show={foodEditToggle}
        onClose={() => {
          setFoodEditToglle(false);
        }}
      >
        <FoodEdit
          food={JSON.stringify(foods[editFoodIndex])}
          categoryId={categoryId}
          onClose={() => {
            setFoodEditToglle(false);
          }}
        ></FoodEdit>
      </Modal>
      {foods
        ? foods.map((element, index) => {
            return (
              <div className="food" key={index}>
                <div className="foodImage">
                  <img src={element.imgUrl} />
                </div>
                <div className="foodContent">
                  <div className="foodDetail">
                    <p className="foodVietnamese">{element.vietnamese}</p>
                    <p className="foodJapanese">{element.japanese}</p>
                    <div className="foodToggle">
                      <p className="foodPrice">{element.price}</p>
                      <Switch
                        checked={element.status}
                        onChange={() => {
                          handleChangeStatus(element.id, element.status);
                        }}
                      ></Switch>
                    </div>
                  </div>
                  <button
                    className="foodButton"
                    onClick={() => {
                      editThisFood(index);
                    }}
                  >
                    S???a
                  </button>
                </div>
              </div>
            );
          })
        : "Loading"}
    </div>
  );
}
