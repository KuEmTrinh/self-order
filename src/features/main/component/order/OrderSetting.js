import React, { useEffect, useState } from "react";
import Modal from "../../../main/component/menu/Modal";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
export default function OrderSetting({
  settingToggle,
  closeSettingToggle,
  order,
  userId,
}) {
  useEffect(() => {
    setCloneOrderList(order);
  }, [order]);
  const [cloneOrderList, setCloneOrderList] = useState("");
  const minusCount = (index) => {
    const newArray = cloneOrderList;
    newArray[index].count -= 1;
    newArray[index].changeStatus = true;
    newArray[index].newPrice -= newArray[index].price;
    setCloneOrderList([...newArray]);
  };

  const plusCount = (index) => {
    const newArray = cloneOrderList;
    newArray[index].count += 1;
    newArray[index].changeStatus = true;
    newArray[index].newPrice += parseInt(newArray[index].price);
    setCloneOrderList([...newArray]);
  };
  const changePriceValue = (e, index) => {
    console.log(e.target.value);
    const newArray = cloneOrderList;
    const changeItem = newArray[index];
    changeItem.changeStatus = true;
    changeItem.price = e.target.value;
    changeItem.newPrice = changeItem.count * changeItem.price;
    setCloneOrderList([...newArray]);
  };
  const saveChangeData = () => {
    cloneOrderList.map((el, index) => {
      if (el.changeStatus) {
        console.log(el.id);
        const changeStatusQuery = db
          .collection("user")
          .doc(userId)
          .collection("order")
          .doc(el.id)
          .update({
            changeStatus: true,
            price: el.price,
            newPrice: el.newPrice,
            count: el.count,
          });
        const createHistory = db
          .collection("user")
          .doc(userId)
          .collection("order")
          .doc(el.id)
          .collection("changeInfo")
          .add({
            oldPrice: parseInt(el.basePrice),
            newPrice: parseInt(el.price),
            oldCount: parseInt(el.maxCount),
            newCount: parseInt(el.count),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        // console.log("this item is changed");
        // console.log(el.maxCount + "->" + el.count);
        // console.log(el.basePrice + "->" + el.price);
        // return { changeStatusQuery, createHistory };
      }
    });
  };
  return (
    <>
      <Modal
        show={settingToggle}
        onClose={() => {
          closeSettingToggle();
        }}
      >
        <div className="orderSettingContent">
          <div className="orderBoxIcon">
            <p className="componentTitle">Chỉnh sữa thông tin</p>
            <div className="orderIconBox">
              <button className="orderSettingButton" onClick={saveChangeData}>
                Cập nhật
              </button>
            </div>
          </div>
          {cloneOrderList ? (
            <div className="orderSettingBox">
              <table className="orderSettingTable">
                <tbody>
                  <tr className="orderSettingTableHeader">
                    <th>Bàn</th>
                    <th>Tên món</th>
                    <th className="widthCountTable">SL</th>
                    <th>Giá</th>
                    <th>Tổng</th>
                    <th>T.Gian</th>
                    {/* <th>Cập nhật</th> */}
                  </tr>
                  {cloneOrderList.map((el, index) => {
                    return (
                      <>
                        {el.status == 1 ? (
                          <tr
                            className={
                              el.changeStatus
                                ? "orderSettingTableItem orderSettingTableItemActive"
                                : "orderSettingTableItem"
                            }
                          >
                            <th>{el.tableName}</th>
                            <th>{el.vietnamese}</th>
                            <th className="orderSettingTableCount">
                              <div className="orderSettingTableCountItem">
                                <div className="orderSettingTableCountIcon">
                                  {el.count > 1 ? (
                                    <RemoveIcon
                                      fontSize="small"
                                      onClick={() => {
                                        minusCount(index);
                                      }}
                                    ></RemoveIcon>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="orderSettingTableCountNumber">
                                  {el.count}
                                </div>
                                <div className="orderSettingTableCountIcon">
                                  {el.count < el.maxCount ? (
                                    <AddIcon
                                      fontSize="small"
                                      onClick={() => {
                                        plusCount(index);
                                      }}
                                    ></AddIcon>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </th>
                            <th className="orderSettingTablePriceChange">
                              <input
                                value={el.price}
                                onChange={(e) => {
                                  changePriceValue(e, index);
                                }}
                                type="number"
                              />
                            </th>
                            <th>{el.newPrice}</th>
                            <th>{el.timeDuration}</th>
                            {/* <th>{el.changeStatus ? "Cập nhật" : ""}</th> */}
                          </tr>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            ""
          )}
        </div>
      </Modal>
    </>
  );
}
