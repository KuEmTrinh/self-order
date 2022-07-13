import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../app/firebase";
import Modal from "../menu/Modal";
import Checkbox from "@mui/material/Checkbox";
export default function OrderFilter({
  filterToggle,
  closeFilterToggle,
  showCategoryList,
  setShowCategoryList,
}) {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [updateTime, setUpdateTime] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const queryUpdateTime = () => {
    const query = db
      .collection("user")
      .doc(uid)
      .onSnapshot((querySnapshot) => {
        setUpdateTime(querySnapshot.data().categoryUpdate);
      });
    return query;
  };
  useEffect(() => {
    console.log("category some thing change");
    let lastUpdateTime = JSON.parse(localStorage.getItem("categoryUpdateTime"));
    console.log(updateTime.seconds);
    console.log(lastUpdateTime.seconds);
    if (updateTime.seconds != lastUpdateTime.seconds) {
      setNewCategoryListData();
    }
  }, [updateTime]);
  useEffect(() => {
    try {
      console.log("lay bo nho tam thoi");
      let categoryList = JSON.parse(localStorage.getItem("category"));
      setShowCategoryList(categoryList);
    } catch (error) {}
    setTimeout(() => {
      queryUpdateTime();
    }, 100);
  }, []);
  const setNewCategoryListData = () => {
    const query = db
      .collection("category")
      .where("uid", "==", uid)
      .orderBy("index")
      .get()
      .then((querySnapshot) => {
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
    return query;
  };

  const categoryItemShowOff = (index) => {
    const changeList = [...showCategoryList];
    changeList[index].show = !changeList[index].show;
    setShowCategoryList([...changeList]);
    localStorage.setItem("category", JSON.stringify(changeList));
    console.log("da luu vao bo nho tam thoi");
  };
  return (
    <>
      <Modal show={filterToggle} onClose={closeFilterToggle}>
        <div className="orderFilterBox">
          <p className="componentTitle">Lọc danh sách</p>
          {showCategoryList ? (
            <div className="categoryFilterList">
              {showCategoryList.map((el, index) => {
                return (
                  <div
                    key={index}
                    className="categoryFilterWrap"
                    onClick={() => {
                      categoryItemShowOff(index);
                    }}
                  >
                    <div className="categoryFilterItem">
                      <p className="categoryFilterName">{el.name}</p>
                      <Checkbox checked={el.show} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            "Loading"
          )}
        </div>
      </Modal>
    </>
  );
}
