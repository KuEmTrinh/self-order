import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import Modal from "../../../main/component/menu/Modal";
export default function OrderItem({ order, userInfo, deleteItem }) {
  const [deleteToggle, setDeleteToggle] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const changeStatus = (id) => {
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
  const openDeleteToggle = (id) => {
    setDeleteToggle(true);
    setDeleteItemId(id);
  };
  const cannelConfirm = () => {
    const query = db
      .collection("user")
      .doc(userInfo.uid)
      .collection("order")
      .doc(deleteItemId)
      .update({
        status: 3,
        updateAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setDeleteToggle(false);
    setDeleteItemId("");
  };
  return (
    <>
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
      <div className="orderList">
        {order.map((el, index) => {
          return (
            <div key={el.id}>
              {el.status == 1 && deleteItem == false ? (
                <div
                  className="orderItem normalBorder"
                  key={index}
                  onClick={() => {
                    changeStatus(el.id);
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
              ) : (
                ""
              )}
              {el.status == 1 && deleteItem == true ? (
                <div
                  className="orderItem normalBorder warningBorder warningBackground"
                  key={index}
                  onClick={() => {
                    openDeleteToggle(el.id);
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
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
