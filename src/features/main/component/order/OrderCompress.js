import React, { useState, useEffect } from "react";

export default function OrderCompress({ order }) {
  //useState
  const [orderCompressList, setOrderCompressList] = useState("");
  //useEffect
  useEffect(() => {
    setOrderCompressList(order);
  }, []);
  useEffect(() => {
    getOrderCompress(order);
  }, [order]);
  //Function
  const getOrderCompress = (order) => {
    const compressedOrderList = [];
    let cloneOrderList = JSON.parse(JSON.stringify(order));
    for (let i = 0; i < cloneOrderList.length; i++) {
      let childrenCompressArray = [];
      let compareFlag = cloneOrderList[i];
      childrenCompressArray.push(compareFlag);
      cloneOrderList.splice(i, 1);
      console.log("---");
      console.log("flag");
      console.log(compareFlag.foodId);
      console.log("end flag");
      for (let j = 0; j < cloneOrderList.length; j++) {
        let compareItem = cloneOrderList[j];
        console.log(compareItem.foodId);
        if (compareItem.foodId == compareFlag.foodId) {
          // console.log("trung lap");
          cloneOrderList.splice(j, 1);
          j -= 1;
        }
      }
      console.log("---");
      i -= 1;
    }
    // console.log(compressedOrderList);
  };
  return <div className="orderList">OrderCompress</div>;
}
