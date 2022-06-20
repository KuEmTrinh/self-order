import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import { useSelector } from "react-redux";
import OrderItem from "./OrderItem";
import OrderComplete from "./OrderComplete";
import OrderSetting from "./OrderSetting";
import OrderCompress from "./OrderCompress";
import DeleteIcon from "@mui/icons-material/Delete";
import CompressIcon from "@mui/icons-material/Compress";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import "./Order.css";
export default function Order() {
  //time duration function
  const diff = (start, end) => {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0) hours = hours + 24;
    if (hours == 0) {
      if (minutes == 0) {
        return "bây giờ";
      } else {
        return minutes + "p";
      }
    } else {
      return hours + "h" + minutes + "p";
    }
  };
  const toDateTime = (secs) => {
    var time = new Date(1970, 1, 0, 9);
    time.setSeconds(secs);
    let hours = time.getHours();
    let min = time.getMinutes();
    return hours + ":" + min;
  };
  const getCurrentTime = () => {
    let today = new Date();
    let hours = today.getHours();
    let min = today.getMinutes();
    return hours + ":" + min;
  };

  //time duration calcutaion
  const getTimeDuration = (secs) => {
    let createdAtTime = toDateTime(secs.seconds);
    let currentTime = getCurrentTime();
    let diffTime = diff(createdAtTime, currentTime);
    return diffTime;
  };

  //end time duration function

  const userInfo = JSON.parse(useSelector((state) => state.login.data));
  const [order, setOrder] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);
  const [completeToggle, setCompleteToggle] = useState(false);
  const [settingToggle, setSettingToggle] = useState(false);
  const [compressToggle, setCompressToggle] = useState(false);
  const deleteToggle = () => {
    setDeleteItem(!deleteItem);
  };
  const openCompleteBox = () => {
    setCompleteToggle(!completeToggle);
  };
  const closeCompleteToggle = () => {
    setCompleteToggle(false);
  };
  const openSettingTable = () => {
    setSettingToggle(true);
  };
  const closeSettingToggle = () => {
    setSettingToggle(false);
  };
  const openCompressToggle = () => {
    setCompressToggle(!compressToggle);
  };
  useEffect(() => {
    const query = db
      .collection("user")
      .doc(userInfo.uid)
      .collection("order")
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        const order = [];
        querySnapshot.docs.map((doc) => {
          order.push({
            id: doc.id,
            foodId: doc.data().foodId,
            vietnamese: doc.data().vietnamese,
            tableName: doc.data().tableName,
            count: doc.data().count,
            maxCount: doc.data().count,
            price: parseInt(doc.data().price),
            basePrice: parseInt(doc.data().price),
            newPrice: parseInt(doc.data().newPrice),
            status: doc.data().status,
            changeStatus: false,
            show: true,
            createdAt: doc.data().createdAt,
            updateAt: doc.data().updateAt,
            timeDuration: getTimeDuration(doc.data().createdAt),
          });
        });
        setOrder(order);
      });
    return query;
  }, []);
  return (
    <>
      {order ? (
        <>
          <div className="orderBoxIcon">
            <p className="componentTitle">Danh sách Order</p>
            <div className="orderIconBox">
              <div className="orderIconItem">
                <DeleteIcon
                  onClick={deleteToggle}
                  color={deleteItem ? "" : "action"}
                ></DeleteIcon>
              </div>
              <div className="orderIconItem">
                <LibraryAddCheckIcon
                  onClick={openCompleteBox}
                  color={completeToggle ? "success" : "action"}
                ></LibraryAddCheckIcon>
              </div>
              <div className="orderIconItem">
                <SettingsSuggestIcon
                  onClick={openSettingTable}
                  color={settingToggle ? "primary" : "action"}
                ></SettingsSuggestIcon>
              </div>
              <div className="orderIconItem">
                <CompressIcon
                  onClick={openCompressToggle}
                  color={compressToggle ? "primary" : "action"}
                ></CompressIcon>
              </div>
            </div>
          </div>
          <OrderComplete
            order={order}
            userInfo={userInfo}
            deleteToggle={deleteToggle}
            completeToggle={completeToggle}
            closeCompleteToggle={closeCompleteToggle}
          ></OrderComplete>
          <OrderSetting
            settingToggle={settingToggle}
            closeSettingToggle={closeSettingToggle}
            order={order}
            userId={userInfo.uid}
          ></OrderSetting>
          {compressToggle ? (
            <OrderCompress order={order}></OrderCompress>
          ) : (
            <OrderItem
              userInfo={userInfo}
              deleteItem={deleteItem}
              order={order}
            />
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}
