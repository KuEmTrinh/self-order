import React, { useEffect, useState } from "react";
import "./List.css";
import { db } from "../../../../app/firebase";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CancelIcon from "@mui/icons-material/Cancel";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { green } from "@mui/material/colors";
import { pink } from "@mui/material/colors";
import Modal from "../../../main/component/menu/Modal";
import Payment from "./Payment";
import ChangeHistory from "./ChangeHistory";
export default function List({ userId, tableId, tableInfo }) {
  const [listData, setListData] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [creatingCount, setCreatingCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const [priceTotal, setPriceTotal] = useState(0);
  const [openPayment, setOpenPayment] = useState(false);
  const [historyToggle, setHistoryToggle] = useState(false);
  const [orderItemId, setOrderItemId] = useState("");
  const diff = (start, end) => {
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
    if (hours == 0) {
      if (minutes == 0) {
        return "bây giờ";
      } else {
        return minutes + " phút trước";
      }
    } else {
      return hours + " tiếng " + minutes + " phút trước";
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

  //time duration calcutaion
  const getTimeDuration = (secs) => {
    let createdAtTime = toDateTime(secs.seconds);
    let currentTime = getCurrentTime();
    let diffTime = diff(createdAtTime, currentTime);
    return diffTime;
  };
  const openHistory = (id) => {
    setOrderItemId(id);
    setHistoryToggle(true);
  };
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
            // sumPrice += parseInt(el.newPrice);
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
            changeStatus: doc.data().changeStatus,
            createdAt: doc.data().createdAt,
            vietnamese: doc.data().vietnamese,
            japanese: doc.data().japanese,
            count: doc.data().count,
            status: doc.data().status,
            imgUrl: doc.data().imgUrl,
            price: doc.data().price,
            newPrice: doc.data().newPrice,
            timeDuration: getTimeDuration(doc.data().createdAt),
          });
        });
        setListData(data);
      });
    return query;
  }, []);
  const openPaymentModal = () => {
    setOpenPayment(true);
  };
  const resetList = () => {
    setOpenPayment(false);
    const query = db
      .collection("user")
      .doc(userId)
      .collection("order")
      .where("tableId", "==", tableId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          doc.ref.delete();
        });
      });
    return query;
  };
  return (
    <div className="listInfomation">
      <Modal
        show={openPayment}
        onClose={() => {
          setOpenPayment(false);
        }}
      >
        <Payment
          priceTotal={priceTotal}
          userId={userId}
          tableId={tableId}
          listData={listData}
          resetList={resetList}
          tableName={tableInfo.name}
          totalCount={totalCount}
          completeCount={completeCount}
          cancelCount={cancelCount}
        ></Payment>
      </Modal>
      <Modal
        show={historyToggle}
        onClose={() => {
          setHistoryToggle(false);
        }}
      >
        <ChangeHistory
          orderItemId={orderItemId}
          userId={userId}
        ></ChangeHistory>
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
                    <p className="listDuration">{el.timeDuration}</p>
                  </div>
                  <div className="listIconBox">
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
                    <div>
                      {el.changeStatus ? (
                        <AutoFixHighIcon
                          fontSize="small"
                          color="action"
                          onClick={() => {
                            openHistory(el.id);
                          }}
                        ></AutoFixHighIcon>
                      ) : (
                        ""
                      )}
                    </div>
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
