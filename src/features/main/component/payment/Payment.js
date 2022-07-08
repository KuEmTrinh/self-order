import React, { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import Method from "./Method";
export default function Payment() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [inputValue, setInputValue] = useState("");
  const createTable = () => {
    if (inputValue.length > 0) {
      const query = db.collection("user").doc(uid).collection("method").add({
        name: inputValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setInputValue("");
      return query;
    } else {
      alert("Loi");
    }
  };
  const onChangeValue = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="method">
      <p className="componentTitle">Phương thức thanh toán</p>
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
        <button className="button button-green" onClick={createTable}>
          Tạo
        </button>
      )}
      <Method userId={uid}></Method>
    </div>
  );
}
