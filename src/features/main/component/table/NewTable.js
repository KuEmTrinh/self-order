import React, { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import TextField from "@mui/material/TextField";

export default function NewTable() {
  const tableCurrentIndex = useSelector(
    (state) => state.table.tableCurrentIndex
  );
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max + 1);
  };
  //useEffect
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const [inputValue, setInputValue] = useState("");
  const createTable = () => {
    if (inputValue.length > 0) {
      db.collection("table").add({
        index: tableCurrentIndex,
        name: inputValue,
        uid: userInfomation.uid,
        code: getRandomInt(10000),
        paymentStatus: false,
        useStatus: false,
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
      <p className="componentTitle">Quản lí Bàn</p>
      <p className="subTitleComponent">Tạo bàn mới</p>
      <div className="deviceInputBox">
        <TextField
          id="outlined-name"
          label="Nhập tên bàn"
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
    </div>
  );
}
