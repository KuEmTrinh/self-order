import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import "./Search.css";
import { useDispatch } from "react-redux";
import { setFoodData, setSearching } from "./searchSlice";
export default function Search({ categoryList, categoryId }) {
  const dispatch = useDispatch();
  const [foods, setFoods] = useState([]);
  const [keyWord, setKeyWord] = useState("");
  useEffect(() => {
    setKeyWord("");
  }, [categoryId]);
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
      const result = el.vietnamese.search(keyWord);
      if (result >= 0 && keyWord != "") {
        resultData.push(foods[index]);
      }
    });
    dispatch(setFoodData(JSON.parse(JSON.stringify(resultData))));
    // console.log(resultData);
  };
  const searchValueChange = (e) => {
    if (e.target.value != "") {
      dispatch(setSearching(true));
    } else {
      dispatch(setSearching(false));
    }
    setKeyWord(e.target.value);
    searchData(e.target.value);
  };
  return (
    <div className="searchBox">
      <input
        value={keyWord}
        className="searchBoxInput"
        onChange={searchValueChange}
      ></input>
    </div>
  );
}
