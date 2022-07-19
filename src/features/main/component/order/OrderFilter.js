import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import { db } from "../../../../app/firebase";
import { arrayUnion, arrayRemove } from "firebase/firestore";
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
  uid,
}) {
  const [deviceList, setDeviceList] = useState("");
  const [showList, setShowList] = useState("");
  const [categoryList, setCategoryList] = useState("");
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
  const fetchCategoryData = () => {
    const query = db
      .collection("category")
      .where("uid", "==", uid)
      .orderBy("index")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            name: doc.data().name,
            show: true,
          });
        });
        setCategoryList(data);
      });
  };
  const changeData = (index, name) => {
    let newArray = JSON.parse(JSON.stringify(showList));
    const query = db
      .collection("user")
      .doc(uid)
      .collection("device")
      .doc(selectDevice.id);
    if (newArray[index].show) {
      query.update({
        list: arrayUnion(name),
      });
    } else {
      query.update({
        list: arrayRemove(name),
      });
    }
    newArray[index].show = !newArray[index].show;
    setShowList(newArray);
  };
  useEffect(() => {
    const filterList = JSON.parse(JSON.stringify(categoryList));
    if (selectDevice) {
      selectDevice.list.map((el) => {
        filterList.map((element) => {
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
    fetchCategoryData();
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
                  {showList.map((item, index) => {
                    return (
                      <div className="showCategoryItem">
                        <FormControlLabel
                          control={<Checkbox checked={item.show} />}
                          label={item.name}
                          onChange={() => {
                            changeData(index, item.name);
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
