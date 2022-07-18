import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../app/firebase";
import Modal from "../menu/Modal";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
export default function OrderFilter({
  filterToggle,
  closeFilterToggle,
  selectDevice,
  setSelectDevice,
  categoryShowList,
  setCategoryShowList,
  categoryList,
  uid,
}) {
  const [deviceList, setDeviceList] = useState("");
  //function
  const fetchDeviceData = () => {
    const query = db
      .collection("user")
      .doc(uid)
      .collection("device")
      .orderBy("name")
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            name: doc.data().name,
            list: doc.data().list,
          });
        });
        setDeviceList(data);
      });
    return query;
  };
  const changeData = (name, status) => {
    if (status) {
      const oldList = [...selectDevice.list];
      oldList.push(name);
      const query = db
        .collection("user")
        .doc(uid)
        .collection("device")
        .doc(selectDevice.id)
        .update({
          list: [...oldList],
        });
    } else {
      const oldList = [...selectDevice.list];
      const newList = oldList.filter((element) => element != name);
      const query = db
        .collection("user")
        .doc(uid)
        .collection("device")
        .doc(selectDevice.id)
        .update({
          list: [...newList],
        });
    }
  };
  useEffect(() => {
    console.log(deviceList);
  }, [deviceList]);
  useEffect(() => {
    fetchDeviceData();
  }, []);
  function renderComponent() {
    return (
      <>
        <div className="orderFilterBox">
          <p className="componentTitle">Lọc danh sách</p>
          <p className="subTitleComponent">Chọn thiết bị</p>
          {deviceList ? (
            <div className="deviceSelectList">
              {deviceList.map((el) => {
                return (
                  <div
                    className={
                      el.id === selectDevice.id
                        ? "deviceItem deviceItemActive"
                        : "deviceItem"
                    }
                    onClick={() => {
                      setSelectDevice(el);
                    }}
                  >
                    {el.name}
                  </div>
                );
              })}
            </div>
          ) : (
            "loading"
          )}
          {categoryList && selectDevice ? (
            <div className="showCategoryList">
              <p className="subTitleComponent">Danh sách</p>
              {categoryList.map((el) => {
                let find = selectDevice.list.find(
                  (element) => element === el.name
                );
                el.show = true;
                if (find) {
                  el.show = false;
                }
                return (
                  <div className="showCategoryItem">
                    <FormControlLabel
                      control={<Checkbox checked={el.show} />}
                      label={el.name}
                      onChange={() => {
                        changeData(el.name, el.show);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="subTitleComponent">Mặc định</p>
          )}
        </div>
      </>
    );
  }
  return (
    <>
      <Modal show={filterToggle} onClose={closeFilterToggle}>
        {renderComponent()}
      </Modal>
    </>
  );
}
