import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import "./Method.css";
export default function Method({ userId }) {
  const [methodData, setMethodData] = useState("");
  useEffect(() => {
    const query = db
      .collection("user")
      .doc(userId)
      .collection("method")
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt,
          });
        });
        setMethodData(data);
      });
    return query;
  }, []);
  return (
    <>
      <p className="componentTitle mt-1">Danh sách Phương thức</p>
      <div className="methodList">
        {methodData ? (
          <>
            {methodData.map((el, index) => {
              return <div className="methodItem" key={index}>{el.name}</div>;
            })}
          </>
        ) : (
          "Loading"
        )}
      </div>
    </>
  );
}
