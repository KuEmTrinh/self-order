import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import Modal from "../../../main/component/menu/Modal";
import Zoom from "@mui/material/Zoom";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import ringer from "./notification.mp3";
import bubble from "./bubble.mp3";
export default function OrderItem({ order, userInfo, deleteItem }) {
  const [deleteToggle, setDeleteToggle] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [deleteIndex, setDeleteIndex] = useState("");
  const [cloneOrder, setCloneOrder] = useState("");
  const [dataLength, setDataLength] = useState("");
  useEffect(() => {
    setCloneOrder([...order]);
    setMinDuration();
    setDataLength(order.length);
  }, [order]);
  useEffect(() => {
    playSoundBubble();
  }, [dataLength]);
  const playSound = () => {
    // console.log("Play")
    const audio = new Audio(ringer);
    audio.play();
  };
  const playSoundBubble = () => {
    // console.log("Play")
    const audio = new Audio(bubble);
    audio.play();
  };
  const changeStatus = (id, index) => {
    // playSound();
    const newOrderList = cloneOrder;
    newOrderList[index].show = false;
    setCloneOrder([...newOrderList]);
    setTimeout(() => {
      const query = db
        .collection("user")
        .doc(userInfo.uid)
        .collection("order")
        .doc(id)
        .update({
          status: 2,
          updateAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }, 250);
  };
  const setMinDuration = () => {
    const setMin = () => {
      const cloneOrderAll = [...order];
      const filterCloneData = cloneOrderAll.filter((data) => data.status == 1);
      filterCloneData.map((el) => {
        el.minDuration = getTimeDuration(el.createdAt);
      });
      setCloneOrder([...filterCloneData]);
    };
    return setMin();
  };
  const openDeleteToggle = (id, index) => {
    setDeleteToggle(true);
    setDeleteItemId(id);
    setDeleteIndex(index);
  };
  const cannelConfirm = () => {
    const newOrderList = cloneOrder;
    newOrderList[deleteIndex].show = false;
    setCloneOrder([...newOrderList]);
    setTimeout(() => {
      const query = db
        .collection("user")
        .doc(userInfo.uid)
        .collection("order")
        .doc(deleteItemId)
        .update({
          status: 3,
          updateAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      setDeleteItemId("");
    }, 250);
    setDeleteToggle(false);
  };

  const diffForMin = (start, end) => {
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
    if (minutes == 0) {
      return null;
    } else {
      return hours * 60 + minutes;
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
  const getTimeDuration = (secs) => {
    let createdAtTime = toDateTime(secs.seconds);
    let currentTime = getCurrentTime();
    let diffTime = diffForMin(createdAtTime, currentTime);
    return diffTime;
  };
  return (
    <>
      {cloneOrder ? (
        <>
          <div className="orderList">
            {cloneOrder.map((el, index) => {
              return (
                <div key={el.id}>
                  {el.status == 1 && deleteItem == false ? (
                    <>
                      <Zoom in={el.show}>
                        <div
                          className="orderItem normalBorder"
                          key={index}
                          onClick={() => {
                            changeStatus(el.id, index);
                          }}
                        >
                          <p className="tableName">{el.tableName}</p>
                          <div className="wrapFlex">
                            <p className="foodName">{el.vietnamese}</p>
                            <p
                              className={
                                el.count > 1
                                  ? "foodCount foodCountSpecial"
                                  : "foodCount"
                              }
                            >
                              {el.count}
                            </p>
                            {el.minDuration >= 5 ? (
                              <>
                                {el.minDuration >= 10 ? (
                                  <div className="durationTimeIcon">
                                    <AccessAlarmsIcon
                                      sx={{
                                        color: "#f44336",
                                      }}
                                      fontSize="small"
                                    ></AccessAlarmsIcon>
                                  </div>
                                ) : (
                                  <div className="durationTimeIcon">
                                    <AccessAlarmsIcon
                                      sx={{
                                        color: "#ff9800",
                                      }}
                                      fontSize="small"
                                    ></AccessAlarmsIcon>
                                  </div>
                                )}
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </Zoom>
                    </>
                  ) : (
                    ""
                  )}
                  {el.status == 1 && deleteItem == true ? (
                    <>
                      <Zoom in={el.show}>
                        <div
                          className="orderItem normalBorder warningBorder warningBackground"
                          key={index}
                          onClick={() => {
                            openDeleteToggle(el.id, index);
                          }}
                        >
                          <p className="tableName">{el.tableName}</p>
                          <div className="wrapFlex">
                            <p className="foodName">{el.vietnamese}</p>
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
                      </Zoom>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        ""
      )}
      <Modal
        show={deleteToggle}
        onClose={() => {
          setDeleteToggle(false);
          setDeleteItemId("");
        }}
      >
        <div className="cartToggleConfirm">
          <button className="cartConfirmButton" onClick={cannelConfirm}>
            Xác nhận
          </button>
        </div>
      </Modal>
    </>
  );
}
