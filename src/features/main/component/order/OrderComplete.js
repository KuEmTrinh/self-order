import React, { useEffect, useState } from "react";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import Modal from "../../../main/component/menu/Modal";
import { firebase } from "../../../../app/firebase";
import { db } from "../../../../app/firebase";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DeleteIcon from "@mui/icons-material/Delete";

export default function OrderComplete({ userInfo, deleteToggle }) {
  const [order, setOrder] = useState("");
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
            updateAt: doc.data().updateAt,
          });
        });
        setOrder(order);
      });
    return query;
  }, []);
  const [completeToggle, setCompleteToggle] = useState(false);
  const openCompleteBox = () => {
    setCompleteToggle(true);
  };
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
          setCompleteToggle(false);
        }}
      >
        <p className="orderCompleteTitle">Lịch sử Hoạt Động</p>
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

      <div className="orderActionBox">
        <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            <SpeedDialAction
              key={"Complete"}
              icon={<LibraryAddCheckIcon></LibraryAddCheckIcon>}
              onClick={openCompleteBox}
              tooltipOpen
              tooltipTitle={"List"}
            />
            <SpeedDialAction
              key={"Delete"}
              icon={<DeleteIcon></DeleteIcon>}
              onClick={deleteToggle}
              tooltipOpen
              tooltipTitle={"Hủy"}
            />
          </SpeedDial>
        </Box>
      </div>
    </>
  );
}
