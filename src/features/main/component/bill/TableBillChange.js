import React, { useState } from "react";
import { db } from "../../../../app/firebase";
import Modal from "../menu/Modal";
export default function TableBillChange({
  currentTableId,
  orderData,
  tableList,
  tableName,
  uid,
  setChangeTableToggle,
}) {
  const [changeTableId, setChangeTableId] = useState("");
  const [changeTableName, setChangeTableName] = useState("");
  const [changeTableIndex, setChangeTableIndex] = useState("");
  const [actionName, setActionName] = useState("");
  const [confirmToggle, setConfirmToggle] = useState(false);
  const checkUsing = (el) => {
    if (el.useStatus) {
      return "tableItem tableItemUsing";
    } else {
      return "tableItem";
    }
  };
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max + 1);
  };
  const randomCodeTable = (tableId) => {
    const query = db
      .collection("table")
      .doc(tableId)
      .update({
        code: getRandomInt(10000),
        paymentStatus: false,
        useStatus: false,
      });
    return query;
  };
  const changeTableConfirm = () => {
    orderData.map((order) => {
      const updateQuery = db
        .collection("user")
        .doc(uid)
        .collection("order")
        .doc(order.id)
        .update({
          tableId: changeTableId,
          tableName: changeTableName,
        });
      return updateQuery;
    });
    if (tableList[changeTableIndex].useStatus == false) {
      const query = db.collection("table").doc(tableList[changeTableIndex].id);
      query.update({
        useStatus: true,
      });
    }
    randomCodeTable(currentTableId);
    setChangeTableToggle(false);
    setConfirmToggle(false);
  };
  return (
    <div className="tableBillChange">
      <Modal
        show={confirmToggle}
        onClose={() => {
          setConfirmToggle(!confirmToggle);
        }}
      >
        <p className="componentTitle">Xác nhận</p>
        <p className="subTitleComponent">
          Lưu ý : Khi bạn xác nhận quá trình gộp đơn thì không thể tách đơn về
          trạng thái ban đầu!
        </p>
        <div
          className="changeTableConfirmButton"
          onClick={() => {
            changeTableConfirm();
          }}
        >
          Xác nhận
        </div>
      </Modal>
      <p className="subTitleComponent">Gộp hoặc chuyển Hóa đơn</p>
      <div className="currentTableBill">
        {changeTableId !== "" ? (
          ""
        ) : (
          <div className="tableCurrentItem tableItemActive">
            <p className="tableItemName">{tableName}</p>
            <p className="tableCurrentTitle">Bàn hiện tại</p>
          </div>
        )}
      </div>
      <p className="subTitleComponent">Các bàn còn lại</p>
      {tableList ? (
        <div className="changeTableList">
          {tableList.map((el, index) => {
            return (
              <>
                {currentTableId == el.id ? (
                  ""
                ) : (
                  <div
                    key={el.id}
                    className={checkUsing(el)}
                    onClick={() => {
                      if (changeTableId === el.id) {
                        setChangeTableId("");
                        setChangeTableName("");
                      } else {
                        setChangeTableId(el.id);
                        setChangeTableName(el.name);
                        if (el.useStatus) {
                          setActionName(1);
                        } else {
                          setActionName(2);
                          setChangeTableIndex(index);
                        }
                      }
                    }}
                  >
                    {changeTableId === el.id ? (
                      <div className="changeTableItem">
                        <p className="changeTableItemName">{tableName}</p>
                      </div>
                    ) : (
                      ""
                    )}
                    <p className="tableItemName">{el.name}</p>
                  </div>
                )}
              </>
            );
          })}
        </div>
      ) : (
        "loading"
      )}
      {changeTableId !== "" ? (
        <p className="subTitleComponent">
          {actionName === 1 ? "Gộp" : "Chuyển"} {tableName}{" "}
          {actionName === 1 ? "với" : "từ"} {changeTableName}
        </p>
      ) : (
        ""
      )}
      <div
        className="changeTableConfirmButton"
        onClick={() => {
          setConfirmToggle(true);
        }}
      >
        Xác nhận
      </div>
    </div>
  );
}
