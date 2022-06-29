import React from "react";
import { db } from "../../../../app/firebase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CategoryList from "./CategoryList";
import { setCategoryCurrentIndex } from "./categorySlice";
import { useDispatch } from "react-redux";
import "./Category.css";
export default function Categories() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [categoryList, setCategoryList] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const query = db
      .collection("category")
      .where("uid", "==", uid)
      .orderBy("index");
    const observer = query.onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.docs.map((doc) => {
        data.push({
          id: doc.id,
          name: doc.data().name,
        });
      });
      dispatch(setCategoryCurrentIndex(data.length));
      setCategoryList(data);
    });
    return observer;
  }, []);
  return (
    <div className="list">
      {categoryList ? (
        <CategoryList categoryList={categoryList}></CategoryList>
      ) : (
        "Loading Data"
      )}
    </div>
  );
}
