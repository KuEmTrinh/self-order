import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import { useSelector } from "react-redux";
export default function TableBill() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [tableList, setTableList] = useState();
  const [tableId, setTableId] = useState("");
  const [tableName, setTableName] = useState("");
  const [orderData, setOrderData] = useState("");
  //useEffect
  useEffect(() => {
    getTableListData();
  }, []);
  useEffect(() => {
    const query = db
      .collection("user")
      .doc(uid)
      .collection("order")
      .orderBy("createdAt", "desc")
      .where("tableId", "==", tableId)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            changeStatus: doc.data().changeStatus,
            createdAt: doc.data().createdAt,
            vietnamese: doc.data().vietnamese,
            japanese: doc.data().japanese,
            count: doc.data().count,
            status: doc.data().status,
            imgUrl: doc.data().imgUrl,
            price: doc.data().price,
            newPrice: doc.data().newPrice,
          });
        });
        setOrderData(data);
      });
    return query;
  }, [tableId]);
  //function
  const getTableListData = () => {
    const query = db
      .collection("table")
      .where("uid", "==", uid)
      .orderBy("index");
    query.get().then((snapshot) => {
      const data = [];
      snapshot.docs.map((doc) => {
        data.push({
          id: doc.id,
          name: doc.data().name,
        });
      });
      setTableList(data);
    });
  };
  return (
    <div className="tableBill">
      <div className="tableBillList">
        <div className="tableBillListTop">
          <p className="subTitleComponent">Danh sách bàn</p>
          <div className="tableList">
            {tableList ? (
              <>
                {tableList.map((el) => {
                  return (
                    <div
                      key={el.index}
                      className={
                        tableId === el.id
                          ? "tableItem tableItemActive"
                          : "tableItem"
                      }
                      onClick={() => {
                        setTableId(el.id);
                        setTableName(el.name);
                      }}
                    >
                      <p className="tableItemName">{el.name}</p>
                    </div>
                  );
                })}
              </>
            ) : (
              "loading"
            )}
          </div>
        </div>
        <div className="tableBillListTop">
          <p className="subTitleComponent">Thông số hóa đơn</p>
          <div className="tableBillOrderDetails">
            <p className="tableBillName">{tableName}</p>
          </div>
        </div>
      </div>
      <div className="orderData">
        <p className="subTitleComponent">Chi tiết hóa đơn</p>
        {orderData ? (
          <>
            {orderData.map((el) => {
              return (
                <div className="orderDataItem" key={el.index}>
                  <p className="orderDataItemName">{el.vietnamese}</p>
                  <div className="orderDataItemInfo">
                    <p className="orderDataItemCount">2</p>
                    <p className="orderDataItemPrice">600</p>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          "loading"
        )}
      </div>
    </div>
  );
}
