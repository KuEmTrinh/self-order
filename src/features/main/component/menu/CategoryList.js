import React from "react";
import { useNavigate } from "react-router-dom";
export default function CategoryList({ categoryList }) {
  let navigate = useNavigate();
  return (
    <>
      <p className="componentTitle categoryList">Danh Mục</p>
      <div className="categories">
        {categoryList.map((element) => {
          return (
            <span
              className="categoryItem"
              key={element.id}
              onClick={() => {
                navigate(`/menu/${element.id}/${element.name}`);
              }}
            >
              {element.name}
            </span>
          );
        })}
      </div>
    </>
  );
}
