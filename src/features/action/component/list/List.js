import React, { useEffect, useState } from "react";
import "./List.css";
import { db } from "../../../../app/firebase";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CancelIcon from "@mui/icons-material/Cancel";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { green } from "@mui/material/colors";
import { pink } from "@mui/material/colors";
import Modal from "../../../main/component/menu/Modal";
import Payment from "./Payment";
export default function List({ userId, tableId }) {
  const [listData, setListData] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [creatingCount, setCreatingCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const [priceTotal, setPriceTotal] = useState(0);
  const [openPayment, setOpenPayment] = useState(false);
  useEffect(() => {
    if (listData) {
      let completeSumCount = 0;
      let creatingSumCount = 0;
      let cancelSumCount = 0;
      let totalSumCount = 0;
      let sumPrice = 0;
      listData.map((el) => {
        switch (el.status) {
          case 1:
            creatingSumCount += el.count;
            totalSumCount += el.count;
            sumPrice += parseInt(el.newPrice);
            break;
          case 2:
            completeSumCount += el.count;
            totalSumCount += el.count;
            sumPrice += parseInt(el.newPrice);
            break;
          case 3:
            cancelSumCount += el.count;
            totalSumCount += el.count;
            sumPrice += parseInt(el.newPrice);
            break;
        }
      });
      setCompleteCount(completeSumCount);
      setCreatingCount(creatingSumCount);
      setCancelCount(cancelSumCount);
      setTotalCount(totalSumCount);
      setPriceTotal(sumPrice);
    }
  }, [listData]);
  useEffect(() => {
    const query = db
      .collection("user")
      .doc(userId)
      .collection("order")
      .where("tableId", "==", tableId)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            vietnamese: doc.data().vietnamese,
            japanese: doc.data().japanese,
            count: doc.data().count,
            status: doc.data().status,
            imgUrl: doc.data().imgUrl,
            price: doc.data().price,
            newPrice: doc.data().newPrice,
          });
        });
        setListData(data);
      });
    return query;
  }, []);
  const openPaymentModal = () => {
    setOpenPayment(true);
  };
  return (
    <div className="listInfomation">
      <Modal
        show={openPayment}
        onClose={() => {
          setOpenPayment(false);
        }}
      >
        <Payment priceTotal={priceTotal}></Payment>
      </Modal>
      <div className="listPayment">
        <div className="listTotal">
          <p>Tổng:{priceTotal}円</p>
        </div>
        <div className="listPaymentButton" onClick={openPaymentModal}>
          <p>Thanh toán</p>
        </div>
      </div>
      <div className="listTotalDetail">
        <div className="listTotalDetailItem">
          <div className="listTotalDetailItemCount">
            <p>{totalCount}</p>
            <div className="listTotalDetailItemIcon">
              <RestaurantMenuIcon color="action" />
            </div>
          </div>
          <div className="listTotalDetailTitle">Tất cả</div>
        </div>
        <div className="listTotalDetailItem">
          <div className="listTotalDetailItemCount">
            <p>{creatingCount}</p>
            <div className="listTotalDetailItemIcon">
              <HourglassTopIcon color="action" />
            </div>
          </div>
          <div className="listTotalDetailTitle">Đang hoàn thành</div>
        </div>
        <div className="listTotalDetailItem">
          <div className="listTotalDetailItemCount">
            <p>{completeCount}</p>
            <div className="listTotalDetailItemIcon">
              <CheckCircleIcon sx={{ color: green[500] }} />
            </div>
          </div>
          <div className="listTotalDetailTitle">
            <p>Hoàn thành</p>
          </div>
        </div>
        <div className="listTotalDetailItem">
          <div className="listTotalDetailItemCount">
            <p>{cancelCount}</p>
            <div className="listTotalDetailItemIcon">
              <CancelIcon sx={{ color: pink[500] }} />
            </div>
          </div>
          <div className="listTotalDetailTitle">Đã hủy</div>
        </div>
      </div>
      {listData ? (
        <div className="listDataWrap">
          {listData.map((el, index) => {
            return (
              <div className="cartItem" key={index}>
                <div className="cartImage">
                  <img src={el.imgUrl} />
                </div>
                <div className="cartItemRight">
                  <div className="cartInfomation">
                    <p className="cartVietnamese">{el.vietnamese}</p>
                    <p className="cartJapanese">{el.japanese}</p>
                    <p className="cartPrice">
                      {el.newPrice} ({el.price} x {el.count})
                    </p>
                  </div>
                  <div>
                    <p>
                      {el.status == 1 ? (
                        <HourglassTopIcon color="action" />
                      ) : (
                        ""
                      )}
                    </p>
                    <p>
                      {el.status == 2 ? (
                        <CheckCircleIcon sx={{ color: green[500] }} />
                      ) : (
                        ""
                      )}
                    </p>
                    <p>
                      {el.status == 3 ? (
                        <CancelIcon sx={{ color: pink[500] }} />
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
