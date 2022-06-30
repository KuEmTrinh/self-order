import React, { useState, useEffect } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Grow from "@mui/material/Grow";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";

export default function OrderCompress({ order, userInfo }) {
  //useState
  const [orderCompressList, setOrderCompressList] = useState("");
  useEffect(() => {
    const compressedOrderData = [...order];
    const filterCompressedOrderData = compressedOrderData.filter(
      (el) => el.status == 1
    );
    // console.log(filterCompressedOrderData);
    getOrderCompress(filterCompressedOrderData);
  }, [order]);
  //Function
  const showChilrenItem = (index) => {
    const showArray = [...orderCompressList];
    showArray[index].show = !showArray[index].show;
    setOrderCompressList([...showArray]);
  };
  const getOrderCompress = (order) => {
    const compressedOrderList = [];
    let cloneOrderList = JSON.parse(JSON.stringify(order));
    for (let i = 0; i < cloneOrderList.length; i++) {
      let childrenCompressArray = [];
      childrenCompressArray.show = false;
      childrenCompressArray.count = 0;
      childrenCompressArray.completeCount = 0;
      let compareFlag = cloneOrderList[i];
      childrenCompressArray.push(compareFlag);
      childrenCompressArray.count += compareFlag.count;
      childrenCompressArray.vietnamese = compareFlag.vietnamese;
      if (compareFlag.status == 2) {
        childrenCompressArray.completeCount += compareFlag.count;
      }
      cloneOrderList.splice(i, 1);
      for (let j = 0; j < cloneOrderList.length; j++) {
        let compareItem = cloneOrderList[j];
        if (compareItem.foodId == compareFlag.foodId) {
          childrenCompressArray.push(compareItem);
          childrenCompressArray.count += compareItem.count;
          if (compareItem.status == 2) {
            childrenCompressArray.completeCount += compareItem.count;
          }
          cloneOrderList.splice(j, 1);
          j -= 1;
        }
      }
      compressedOrderList.push(childrenCompressArray);
      i -= 1;
    }
    setOrderCompressList(compressedOrderList);
    // console.log(compressedOrderList);
  };

  const changeStatus = (id) => {
    // console.log(id);
    const query = db
      .collection("user")
      .doc(userInfo.uid)
      .collection("order")
      .doc(id)
      .update({
        status: 2,
        updateAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };
  return (
    <div className="orderList">
      {orderCompressList ? (
        <>
          {orderCompressList.map((el, index) => {
            return (
              <>
                {el.length == 1 ? (
                  <div
                    className="orderItem normalBorder"
                    onClick={() => {
                      changeStatus(el[0].id);
                    }}
                  >
                    <p className="tableName">{el[0].tableName}</p>
                    <div className="wrapFlex">
                      <p className="foodName">{el[0].vietnamese}</p>
                      <p
                        className={
                          el.count > 1
                            ? "foodCount foodCountSpecial"
                            : "foodCount"
                        }
                      >
                        {el.count}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="compressOrderList">
                    {el.show ? (
                      <>
                        <div
                          className="compressTitle normalBorder"
                          onClick={() => {
                            showChilrenItem(index);
                          }}
                        >
                          <div className="compressInfoBox">
                            <p className="compressFoodVietnames">
                              {el.vietnamese}{" "}
                            </p>
                            <p className="compressTotalCount">{el.count}</p>
                          </div>
                          <ArrowDropUpIcon></ArrowDropUpIcon>
                        </div>
                        {/* Conditionally applies the timeout prop to change the entry speed. */}
                        <div className="compressBox">
                          {el.map((compressEl, index) => {
                            return (
                              <Grow
                                in={el.show}
                                style={{ transformOrigin: "0 0 0" }}
                                {...(el.show ? { timeout: index * 300 } : {})}
                              >
                                <div
                                  className="orderItem normalBorder"
                                  onClick={() => {
                                    changeStatus(compressEl.id);
                                  }}
                                >
                                  <p className="tableName">
                                    {compressEl.tableName}
                                  </p>
                                  <div className="wrapFlex">
                                    <p className="foodName">
                                      {compressEl.vietnamese}
                                    </p>
                                    <p
                                      className={
                                        compressEl.count > 1
                                          ? "foodCount foodCountSpecial"
                                          : "foodCount"
                                      }
                                    >
                                      {compressEl.count}
                                    </p>
                                  </div>
                                </div>
                              </Grow>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div
                        className="compressTitle normalBorder"
                        onClick={() => {
                          showChilrenItem(index);
                        }}
                      >
                        <div className="compressInfoBox">
                          <p className="compressFoodVietnames">
                            {el.vietnamese}{" "}
                          </p>
                          <p className="compressTotalCount">{el.count}</p>
                        </div>
                        <ArrowDropDownIcon></ArrowDropDownIcon>
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          })}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
