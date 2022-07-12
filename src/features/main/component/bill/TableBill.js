import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import { useSelector } from "react-redux";
import TablePayment from "./TablePayment";
import Modal from "../menu/Modal";
export default function TableBill() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [tableList, setTableList] = useState();
  const [tableId, setTableId] = useState("");
  const [tableName, setTableName] = useState("Trống");
  const [orderData, setOrderData] = useState("");
  const [tableFoodTotal, setTableFoodTotal] = useState("");
  const [tablePriceTotal, setTablePriceTotal] = useState("");
  const [paymentToggle, setPaymentToggle] = useState(false);
  const [inputPrice, setInputPrice] = useState("");
  const [returnPrice, setReturnPrice] = useState(0);
  //useEffect
  useEffect(() => {
    getTableListData();
  }, []);
  useEffect(() => {
    setReturnPrice(inputPrice - tablePriceTotal);
  }, [inputPrice]);

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
        getTableInfo(data);
        setReturnPrice(0);
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
  const getTableInfo = (data) => {
    let tablePriceTotal = 0;
    let foodTotal = 0;
    data.map((el) => {
      if (el.status === 2) {
        tablePriceTotal += parseInt(el.newPrice);
      }
      foodTotal += parseInt(el.count);
    });
    setTablePriceTotal(tablePriceTotal);
    setTableFoodTotal(foodTotal);
    setInputPrice(tablePriceTotal);
  };
  return (
    <div className="tableBill">
      <Modal
        show={paymentToggle}
        onClose={() => {
          setPaymentToggle(false);
        }}
      >
        <TablePayment
          tablePriceTotal={tablePriceTotal}
          setInputPrice={setInputPrice}
          setReturnPrice={setReturnPrice}
          inputPrice={inputPrice}
          returnPrice={returnPrice}
        />
      </Modal>

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
            <div className="tableBillName">
              <p className="tableBillContent">{tableName}</p>
              <p className="tableBillSubTitle">Bàn</p>
            </div>
            <div className="tableBillFoodTotol">
              <p className="tableBillContent">{tableFoodTotal}</p>
              <p className="tableBillSubTitle">Món</p>
            </div>
            <div className="tableBillPriceTotal">
              <p className="tableBillContent">{tablePriceTotal}</p>
              <p className="tableBillSubTitle">Tổng</p>
            </div>
          </div>
          {orderData != "" ? (
            <div
              className="tableBillPaymentBox"
              onClick={() => {
                setPaymentToggle(true);
              }}
            >
              <p className="tableBillPaymentButton">Thanh toán</p>
            </div>
          ) : (
            ""
          )}
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
                    <p className="orderDataItemCount">{el.count}</p>
                    <p className="orderDataItemPrice">{el.newPrice}</p>
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
