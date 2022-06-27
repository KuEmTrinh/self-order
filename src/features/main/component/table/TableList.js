import React from "react";
import { db } from "../../../../app/firebase";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TableItem from "./TableItem";
import { setTableCurrentIndex } from "./tableSlice";
export default function TableList() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [tableListData, setTableListData] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const query = db
      .collection("table")
      .where("uid", "==", uid)
      .orderBy("index");
    const observer = query.onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.docs.map((doc) => {
        data.push({
          id: doc.id,
          index: doc.data().index,
          code: doc.data().code,
          name: doc.data().name,
        });
      });
      // console.log(data.length);
      dispatch(setTableCurrentIndex(data.length));
      setTableListData(data);
    });
    return observer;
  }, []);
  useEffect(() => {
    dispatch(setTableCurrentIndex(tableListData.length));
  }, [tableListData]);
  return (
    <div className="list">
      {tableListData ? <TableItem tables={tableListData} /> : "Loading Data"}
    </div>
  );
}
