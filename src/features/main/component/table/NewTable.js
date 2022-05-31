import React, { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
export default function NewTable() {
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max + 1);
  };

  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const [inputValue, setInputValue] = useState("");
  const createTable = () => {
    if (inputValue.length > 0) {
      db.collection("table").add({
        name: inputValue,
        uid: userInfomation.uid,
        code: getRandomInt(10000),
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
    <div>
      <p className="componentTitle">Tạo Bàn</p>
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
      <button className="button button-green" onClick={createTable}>
        Tạo
      </button>
    </div>
  );
}
