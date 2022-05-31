import React, { useEffect, useState } from "react";
import "./Categories.css";
import FoodList from "../food/FoodList";
export default function Categories({ data }) {
  useEffect(()=>{
    setCategoryId(data[0].id)
  },[])
  const [categoryId, setCategoryId] = useState("");
  const [indexCategory, setIndexCategory] = useState(0);
  return (
    <>
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
      {categoryId ? <FoodList categoryId={categoryId}></FoodList> : ""}
    </>
  );
}
