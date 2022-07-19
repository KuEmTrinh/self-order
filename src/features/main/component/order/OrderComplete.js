import React, { useEffect, useState } from "react";
import Modal from "../../../main/component/menu/Modal";
import { firebase } from "../../../../app/firebase";
import { db } from "../../../../app/firebase";

export default function OrderComplete({
  userInfo,
  completeToggle,
  closeCompleteToggle,
}) {
  useEffect(() => {
    const query = db
      .collection("user")
      .doc(userInfo.uid)
      .collection("order")
      .orderBy("updateAt", "desc")
      .onSnapshot((querySnapshot) => {
        const order = [];
        querySnapshot.docs.map((doc) => {
          order.push({
            id: doc.id,
            vietnamese: doc.data().vietnamese,
            tableName: doc.data().tableName,
            count: doc.data().count,
            status: doc.data().status,
            createdAt: doc.data().createdAt,
            details: doc.data().details,
            updateAt: doc.data().updateAt,
          });
        });
        setOrder(order);
      });
    return query;
  }, []);
  const [order, setOrder] = useState("");
  const changeStatus = (id) => {
    const query = db
      .collection("user")
      .doc(userInfo.uid)
      .collection("order")
      .doc(id)
      .update({
        status: 1,
        updateAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };
  return (
    <>
      <Modal
        show={completeToggle}
        onClose={() => {
          closeCompleteToggle();
        }}
      >
        <p className="componentTitle orderCompleteTitle">Lịch sử Hoạt Động</p>
        {order ? (
          <div className="orderCompleteBox">
            {order.map((el, index) => {
              return (
                <div key={el.id}>
                  {el.status == 2 || el.status == 3 ? (
                    <div
                      className={
                        el.status == 2
                          ? "orderItem orderItemGreenBackground greenBorder"
                          : "orderItem warningBorder warningBackground"
                      }
                      key={index}
                      onClick={() => {
                        changeStatus(el.id);
                      }}
                    >
                      <div className="orderItemMainInfo">
                        <p className="tableName">{el.tableName}</p>
                        <div className="wrapFlex">
                          <p className="foodName">{el.vietnamese}</p>
                          <p
                            className={
                              el.count > 1
                                ? el.status == 2
                                  ? "foodCount foodCountSpecial foodCountSpecialGreen"
                                  : "foodCount foodCountSpecial foodCountSpecialWarning"
                                : "foodCount"
                            }
                          >
                            {el.count}
                          </p>
                        </div>
                      </div>
                      {el.details ? (
                        <div className="propertyDetailsBox mt-05">
                          {el.details.map((item) => {
                            return (
                              <span className="orderDetailsItem">{item}</span>
                            );
                          })}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
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
      </Modal>
    </>
  );
}
