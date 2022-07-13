import React from "react";
import { useState } from "react";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import { useSelector } from "react-redux";
export default function NewCategory() {
  const categoryCurrentIndex = useSelector(
    (state) => state.category.categoryCurrentIndex
  );
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const [inputValue, setInputValue] = useState("");
  const createCategory = () => {
    if (inputValue.length > 0) {
      db.collection("user").doc(userInfomation.uid).update({
        categoryUpdate: firebase.firestore.FieldValue.serverTimestamp(),
      });
      db.collection("category").add({
        index: categoryCurrentIndex,
        name: inputValue,
        uid: userInfomation.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setInputValue("");
    } else {
      alert("Loi");
    }
  };
  const onChangeValue = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <>
      <p className="componentTitle">Tạo Danh Mục</p>
      <div className="inputBox flex align-center">
        <p className="inputBoxTitle">Tên</p>
        <input
          value={inputValue}
          className="inputBoxEnter"
          onChange={(e) => {
            onChangeValue(e);
          }}
        />
      </div>
      {inputValue === "" ? (
        ""
      ) : (
        <button
          className="button button-green"
          onClick={() => {
            createCategory();
          }}
        >
          Tạo
        </button>
      )}
    </>
  );
}
