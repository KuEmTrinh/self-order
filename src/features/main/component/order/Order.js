import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import { useSelector } from "react-redux";
import OrderItem from "./OrderItem";
import OrderComplete from "./OrderComplete";
import OrderSetting from "./OrderSetting";
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import "./Order.css";
export default function Order() {
  const userInfo = JSON.parse(useSelector((state) => state.login.data));
  const [order, setOrder] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);
  const [completeToggle, setCompleteToggle] = useState(false);
  const [settingToggle, setSettingToggle] = useState(false)
  const deleteToggle = () => {
    setDeleteItem(!deleteItem);
  };
  const openCompleteBox = () => {
    setCompleteToggle(!completeToggle);
  };
  const closeCompleteToggle = () => {
    setCompleteToggle(false);
  }
  const openSettingTable = ()=> {
    setSettingToggle(true)
  }
  const closeSettingToggle = () => {
    setSettingToggle(false);
  }
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
            vietnamese: doc.data().vietnamese,
            tableName: doc.data().tableName,
            count: doc.data().count,
            price: doc.data().price,
            newPrice: doc.data().newPrice,
            status: doc.data().status,
            changeStatus: false,
            createdAt: doc.data().createdAt,
            updateAt: doc.data().updateAt,
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
                <DeleteIcon onClick={deleteToggle} color={deleteItem ? "" : "action"}></DeleteIcon>
              </div>
              <div className="orderIconItem">
                <LibraryAddCheckIcon onClick={openCompleteBox} color={completeToggle ? "success" : "action"}></LibraryAddCheckIcon>
              </div>
              <div className="orderIconItem">
                <SettingsSuggestIcon onClick={openSettingTable} color={settingToggle ? "primary" : "action"}></SettingsSuggestIcon>
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
          <OrderItem
            userInfo={userInfo}
            deleteItem={deleteItem}
            order={order}
          />
          <OrderSetting settingToggle={settingToggle} closeSettingToggle={closeSettingToggle} order={order}></OrderSetting>
        </>
      ) : (
        ""
      )}
    </>
  );
}
