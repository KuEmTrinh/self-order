import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import "./Search.css";
export default function Search({ categoryList }) {
  const [foods, setFoods] = useState([]);
  useEffect(() => {
    const data = [];
    categoryList.map((el) => {
      const fetchFoodData = async () => {
        const query = await db
          .collection("category")
          .doc(el.id)
          .collection("food")
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs.map((el) => {
              data.push(el.data());
            });
          });
        return query;
      };
      fetchFoodData();
    });
    setFoods(data);
  }, []);
  const searchData = (keyWord) => {
    const resultData = [];
    foods.map((el, index) => {
      const keyWordArray = el.vietnamese.split(" ");
      keyWordArray.map((el) => {
        if (keyWord == el) {
          console.log("true");
          resultData.push(foods[index]);
        }
      });
    });
    console.log(resultData);
  };
  const searchValue = (e) => {
    const keyWord = e.target.value;
    searchData(keyWord);
  };
  return (
    <div className="searchBox">
      <input className="searchBoxInput" onChange={searchValue}></input>
    </div>
  );
}
