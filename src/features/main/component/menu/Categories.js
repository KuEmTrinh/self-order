import React from "react";
import { db } from "../../../../app/firebase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CategoryList from "./CategoryList";
import "./Category.css";
export default function Categories() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [categoryList, setCategoryList] = useState("");
  useEffect(() => {
    const query = db
      .collection("category")
      .where("uid", "==", uid)
      .orderBy("createdAt");
    const observer = query.onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.docs.map((doc) => {
        data.push({
          id: doc.id,
          name: doc.data().name,
        });
      });
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
