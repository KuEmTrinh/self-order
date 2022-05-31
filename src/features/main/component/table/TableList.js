import React from "react";
import { db } from "../../../../app/firebase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TableItem from "./TableItem";
export default function TableList() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [tableListData, setTableListData] = useState("");
  useEffect(() => {
    const query = db.collection("table").where("uid", "==", uid);
    const observer = query.onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.docs.map((doc) => {
        data.push({
          id: doc.id,
          code: doc.data().code,
          name: doc.data().name,
        });
      });
      setTableListData(data);
    });
    return observer;
  }, []);
  return (
    <div className="list">
      {tableListData ? <TableItem tables={tableListData} /> : "Loading Data"}
    </div>
  );
}
