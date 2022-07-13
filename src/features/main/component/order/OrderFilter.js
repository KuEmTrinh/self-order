import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../app/firebase";
import Modal from "../menu/Modal";
import Checkbox from "@mui/material/Checkbox";
export default function OrderFilter({
  filterToggle,
  closeFilterToggle,
  showCategoryList,
  setShowCategoryList
}) {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  // useEffect
  useEffect(() => {
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

      let localStorageCategoryList = JSON.parse(
        localStorage.getItem("category")
      );
      if (localStorageCategoryList) {
        setShowCategoryList(localStorageCategoryList);
      } else {
        setShowCategoryList(data);
      }
      if (localStorageCategoryList.length != data.length) {
        localStorage.setItem("category", JSON.stringify(data));
      }
    });
    return observer;
  }, []);
  const categoryItemShowOff = (index) => {
    const changeList = [...showCategoryList];
    changeList[index].show = !changeList[index].show;
    setShowCategoryList([...changeList]);
    localStorage.setItem("category", JSON.stringify(changeList));
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
