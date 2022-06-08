import React, { useEffect, useState } from "react";
import { db } from "../../../../app/firebase";

export default function History({ userId, tableId }) {
  const [historyData, setHistoryData] = useState("");
  useEffect(() => {
    const query = db
      .collection("user")
      .doc(userId)
      .collection("order")
      .where("tableId", "==", tableId)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            vietnamese: doc.data().vietnamese,
            japanese: doc.data().japanese,
            count: doc.data().count,
            status: doc.data().status,
            imgUrl: doc.data().imgUrl,
            price: doc.data().price,
            newPrice: doc.data().newPrice,
          });
        });
        console.log(data);
        setHistoryData(data);
      });
    return query;
  }, []);
  return (
    <div className="historyBoxContent">
      <p className="componentTitle">Lịch sử gọi món</p>
      {historyData ? (
        <div className="historyList">
          {historyData.map((el, index) => {
            return (
              <div className="historyItem" key={index}>
                <div className="historyImage">
                  <img src={el.imgUrl} />
                </div>
                <div className="historyItemRight">
                  <div className="historyInfomation">
                    <p className="historyVietnamese">{el.vietnamese}</p>
                    <p className="historyJapanese">{el.japanese}</p>
                    <p className="historyPrice">{el.price}</p>
                  </div>
                  {el.status ? (
                    <button className="historyButton">Chọn</button>
                  ) : (
                    <button className="historyButton historyDisableButton" disabled>Chọn</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        "Loading"
      )}
    </div>
  );
}
