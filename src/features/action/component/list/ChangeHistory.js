import React, { useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { db } from "../../../../app/firebase";
import "./ChangeHistory.css";
export default function ChangeHistory({ orderItemId, userId }) {
  const [changeData, setChangeData] = useState();
  const toDateTime = (secs) => {
    var time = new Date(1970, 1, 0, 9);
    time.setSeconds(secs);
    let hours = time.getHours();
    let min = time.getMinutes();
    return hours + ":" + min;
  };
  useEffect(() => {
    const query = db
      .collection("user")
      .doc(userId)
      .collection("order")
      .doc(orderItemId)
      .collection("changeInfo")
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            createdAt: toDateTime(doc.data().createdAt),
            oldCount: doc.data().oldCount,
            newCount: doc.data().newCount,
            oldPrice: doc.data().oldPrice,
            newPrice: parseInt(doc.data().newPrice),
          });
        });
        console.log(data);
        setChangeData(data);
      });
    return query;
  }, []);
  return (
    <div className="changeHistoryBox">
      <p className="componentTitle">Chi tiết sửa đổi</p>
      {changeData ? (
        <div className="changeHistoryContent">
          {changeData.map((el) => {
            return (
              <div className="changeHistoryContentItem">
                <hr></hr>
                <div className="changeHistoryContentTime">
                  <AccessTimeIcon color="action"></AccessTimeIcon>
                  <p> {el.createdAt}</p>
                </div>
                {el.oldCount != el.newCount ? (
                  <p className="changeHistoryContentDetails">
                    Số lượng: {el.oldCount} <ArrowRightAltIcon /> {el.newCount}
                  </p>
                ) : (
                  ""
                )}
                {el.oldPrice != el.newPrice ? (
                  <p className="changeHistoryContentDetails">
                    Giá: {el.oldPrice} <ArrowRightAltIcon /> {el.newPrice}
                  </p>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
