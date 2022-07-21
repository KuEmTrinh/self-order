import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import { useSelector } from "react-redux";
import TablePayment from "./TablePayment";
import Modal from "../menu/Modal";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import TableBillChange from "./TableBillChange";
export default function TableBill() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [tableList, setTableList] = useState();
  const [tableId, setTableId] = useState("");
  const [tableName, setTableName] = useState("Trống");
  const [orderData, setOrderData] = useState("");
  const [tableFoodTotal, setTableFoodTotal] = useState("");
  const [tableFoodCancel, setTableFoodCancel] = useState("");
  const [tableFoodComplete, setTableFoodComplete] = useState("");
  const [tablePriceTotal, setTablePriceTotal] = useState("");
  const [paymentToggle, setPaymentToggle] = useState(false);
  const [inputPrice, setInputPrice] = useState("");
  const [returnPrice, setReturnPrice] = useState(0);
  const [changeTableToggle, setChangeTableToggle] = useState(false);
  const [currentTableId, setCurrentTableId] = useState("");
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
      .orderBy("index")
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            name: doc.data().name,
            useStatus: doc.data().useStatus,
          });
        });
        setTableList(data);
      });
    return query;
  };
  const checkUsing = (el) => {
    if (el.useStatus) {
      return "tableItem tableItemUsing";
    } else {
      return "tableItem";
    }
  };
  const getTableInfo = (data) => {
    let tablePriceTotal = 0;
    let foodTotal = 0;
    let foodCancel = 0;
    let foodComplete = 0;
    data.map((el) => {
      if (el.status === 2) {
        tablePriceTotal += parseInt(el.newPrice);
        foodComplete += parseInt(el.count);
      }
      foodTotal += parseInt(el.count);
      if (el.status === 3) {
        foodCancel += parseInt(el.count);
      }
    });
    setTablePriceTotal(tablePriceTotal);
    setTableFoodTotal(foodTotal);
    setInputPrice(tablePriceTotal);
    setTableFoodCancel(foodCancel);
    setTableFoodComplete(foodComplete);
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
          orderData={orderData}
          tableName={tableName}
          tableFoodTotal={tableFoodTotal}
          tableFoodCancel={tableFoodCancel}
          tableFoodComplete={tableFoodComplete}
          tableId={tableId}
          uid={uid}
          setPaymentToggle={setPaymentToggle}
        />
      </Modal>
      <Modal
        show={changeTableToggle}
        onClose={() => {
          setChangeTableToggle(false);
        }}
      >
        <TableBillChange
          currentTableId={currentTableId}
          orderData={orderData}
          tableList={tableList}
          tableName={tableName}
          uid={uid}
          setChangeTableToggle={setChangeTableToggle}
        ></TableBillChange>
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
                          : checkUsing(el)
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
          <div className="tableBillFeature">
            <p className="subTitleComponent">Thông số hóa đơn</p>
            <div className="tableBillFeatureBox">
              {tableId === "" ? (
                ""
              ) : (
                <div
                  className="tableBillFeatureItem"
                  onClick={() => {
                    setChangeTableToggle(!changeTableToggle);
                    setCurrentTableId(tableId);
                  }}
                >
                  <p>Chuyển bàn</p>
                  <MoveDownIcon color="action" fontSize="small"></MoveDownIcon>
                </div>
              )}
            </div>
          </div>
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
                    <p className="orderDataItemCount">({el.count})</p>
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
