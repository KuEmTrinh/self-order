import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { db } from "../../../../app/firebase";
import { useSelector } from "react-redux";
import OrderItem from "./OrderItem";
import OrderComplete from "./OrderComplete";
import OrderSetting from "./OrderSetting";
import OrderCompress from "./OrderCompress";
import OrderFilter from "./OrderFilter";
import DeleteIcon from "@mui/icons-material/Delete";
import CompressIcon from "@mui/icons-material/Compress";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import ringer from "./notification.mp3";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import "./Order.css";
export default function Order() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  //color theme
  const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: purple[500],
      },
      secondary: {
        // This is green.A700 as hex.
        main: "#11cb5f",
      },
      whiteColor: {
        // This is green.A700 as hex.
        main: "#fff",
      },
    },
  });
  //time duration function
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
        return minutes + "p";
      }
    } else {
      return hours + "h" + minutes + "p";
    }
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

  //time duration calcutaion
  const getTimeDuration = (secs) => {
    let createdAtTime = toDateTime(secs.seconds);
    let currentTime = getCurrentTime();
    let diffTime = diff(createdAtTime, currentTime);
    return diffTime;
  };
  const playSound = () => {
    // console.log("Play")
    const audio = new Audio(ringer);
    audio.play();
  };
  //end time duration function
  const userInfo = JSON.parse(useSelector((state) => state.login.data));
  const [order, setOrder] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);
  const [completeToggle, setCompleteToggle] = useState(false);
  const [settingToggle, setSettingToggle] = useState(false);
  const [compressToggle, setCompressToggle] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);
  const [orderLength, setOrderLength] = useState();
  const deleteToggle = () => {
    setDeleteItem(!deleteItem);
  };
  const openCompleteBox = () => {
    setCompleteToggle(!completeToggle);
  };
  const closeCompleteToggle = () => {
    setCompleteToggle(false);
  };
  const openSettingTable = () => {
    setSettingToggle(!settingToggle);
  };
  const closeSettingToggle = () => {
    setSettingToggle(false);
  };
  const openCompressToggle = () => {
    setCompressToggle(!compressToggle);
  };
  const openFilterToggle = () => {
    setFilterToggle(!filterToggle);
  };
  const closeFilterToggle = () => {
    setFilterToggle(false);
  };
  const queryCategoryData = () => {
    const query = db
      .collection("category")
      .where("uid", "==", uid)
      .orderBy("index");
    const observer = query.onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.docs.map((doc) => {
        data.push({
          id: doc.id,
          name: doc.data().name,
          show: true,
        });
      });
      localStorage.setItem("category", JSON.stringify(data));
    });
    return observer;
  };
  const fetchData = () => {
    let localStorageCategoryList = JSON.parse(localStorage.getItem("category"));
    const query = db
      .collection("user")
      .doc(userInfo.uid)
      .collection("order")
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        const order = [];
        querySnapshot.docs.map((doc) => {
          let checkId = doc.data().categoryId;
          let checkItem = localStorageCategoryList.find(
            (el) => el.id === checkId
          );
          if (checkItem.show) {
            order.push({
              id: doc.id,
              foodId: doc.data().foodId,
              vietnamese: doc.data().vietnamese,
              tableName: doc.data().tableName,
              count: doc.data().count,
              maxCount: doc.data().count,
              price: parseInt(doc.data().price),
              basePrice: parseInt(doc.data().price),
              newPrice: parseInt(doc.data().newPrice),
              status: doc.data().status,
              changeStatus: false,
              show: true,
              createdAt: doc.data().createdAt,
              updateAt: doc.data().updateAt,
              timeDuration: getTimeDuration(doc.data().createdAt),
              minDuration: 0,
            });
          }
        });
        setOrder(order);
      });
    return query;
  };
  useEffect(() => {
    let localStorageCategoryList = JSON.parse(localStorage.getItem("category"));
    if (localStorageCategoryList) {
      fetchData();
    } else {
      queryCategoryData();
      setTimeout(() => {
        fetchData();
      }, 1000);
    }
  }, []);
  return (
    <>
      {order ? (
        <>
          <div className="orderBoxIcon">
            <p className="componentTitle">Danh sách Order</p>
            <ThemeProvider theme={theme}>
              <div className="orderIconBox">
                <div
                  className={
                    deleteItem
                      ? "orderIconItem waringRedColor"
                      : "orderIconItem"
                  }
                  onClick={deleteToggle}
                >
                  <DeleteIcon
                    color={deleteItem ? "whiteColor" : "action"}
                  ></DeleteIcon>
                </div>
                <div
                  className={
                    completeToggle
                      ? "orderIconItem usingActiveColor"
                      : "orderIconItem"
                  }
                  onClick={openCompleteBox}
                >
                  <LibraryAddCheckIcon
                    color={completeToggle ? "whiteColor" : "action"}
                  ></LibraryAddCheckIcon>
                </div>
                <div
                  className={
                    settingToggle
                      ? "orderIconItem usingActiveColor"
                      : "orderIconItem"
                  }
                  onClick={openSettingTable}
                >
                  <SettingsSuggestIcon
                    color={settingToggle ? "whiteColor" : "action"}
                  ></SettingsSuggestIcon>
                </div>
                <div
                  className={
                    compressToggle
                      ? "orderIconItem usingActiveColor"
                      : "orderIconItem"
                  }
                  onClick={openCompressToggle}
                >
                  <CompressIcon
                    color={compressToggle ? "whiteColor" : "action"}
                  ></CompressIcon>
                </div>
                <div
                  className={
                    filterToggle
                      ? "orderIconItem usingActiveColor"
                      : "orderIconItem"
                  }
                  onClick={openFilterToggle}
                >
                  <FilterAltIcon
                    color={filterToggle ? "whiteColor" : "action"}
                  ></FilterAltIcon>
                </div>
              </div>
            </ThemeProvider>
          </div>
          <OrderComplete
            order={order}
            userInfo={userInfo}
            deleteToggle={deleteToggle}
            completeToggle={completeToggle}
            closeCompleteToggle={closeCompleteToggle}
          ></OrderComplete>
          <OrderSetting
            settingToggle={settingToggle}
            closeSettingToggle={closeSettingToggle}
            order={order}
            userId={userInfo.uid}
          ></OrderSetting>
          <OrderFilter
            filterToggle={filterToggle}
            closeFilterToggle={closeFilterToggle}
          ></OrderFilter>
          {compressToggle ? (
            <OrderCompress order={order} userInfo={userInfo}></OrderCompress>
          ) : (
            <OrderItem
              userInfo={userInfo}
              deleteItem={deleteItem}
              order={order}
            />
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}
