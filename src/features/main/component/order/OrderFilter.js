import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
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
  const [showList, setShowList] = useState("");
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
    console.log(categoryList);
    const filterList = [...categoryList];
    console.log(filterList);
    if (selectDevice) {
      selectDevice.list.map((el) => {
        filterList.map((element) => {
          element.show = true;
          if (element.name == el) {
            element.show = false;
          }
        });
      });
      // console.log(filterList);
      setShowList([...filterList]);
    }
  }, [selectDevice]);
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
          {selectDevice ? (
            <>
              {showList ? (
                <div className="showCategoryList">
                  <p className="subTitleComponent">Danh sách</p>
                  {showList.map((item) => {
                    return (
                      <div className="showCategoryItem">
                        <FormControlLabel
                          control={<Checkbox checked={item.show} />}
                          label={item.name}
                          onChange={() => {
                            // changeData(el.name, el.show);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            "false"
          )}
          {/* {categoryList && selectDevice ? (
            <div className="showCategoryList">
              <p className="subTitleComponent">Danh sách</p>
              {categoryList.map((el) => {
                return (
                  <div className="showCategoryItem">
                    <FormControlLabel
                      control={<Checkbox checked={true} />}
                      label={el.name}
                      onChange={() => {
                        // changeData(el.name, el.show);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="subTitleComponent">Mặc định</p>
          )} */}
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
