import React, { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import Method from "./Method";
import TextField from "@mui/material/TextField";

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
      <p className="componentTitle">Quản lí Phương thức</p>
      <p className="subTitleComponent">Tạo phương thức mới</p>
      <div className="deviceInputBox">
        <TextField
          id="outlined-name"
          label="Nhập tên danh sách"
          onChange={(e) => {
            onChangeValue(e);
          }}
          value={inputValue}
        />
        {inputValue !== "" ? (
          <div
            className="deviceCreateButton"
            onClick={() => {
              createTable();
            }}
          >
            Tạo
          </div>
        ) : (
          ""
        )}
      </div>
      <Method userId={uid}></Method>
    </div>
  );
}
