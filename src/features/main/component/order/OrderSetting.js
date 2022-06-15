import React, { useEffect, useState } from "react";
import Modal from "../../../main/component/menu/Modal";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
export default function OrderSetting({
  settingToggle,
  closeSettingToggle,
  order,
}) {
  useEffect(() => {
    setCloneOrderList(order);
  }, []);
  const [cloneOrderList, setCloneOrderList] = useState("");
  const minusCount = (index) => {
    const newArray = cloneOrderList;
    newArray[index].count -= 1;
    newArray[index].changeStatus = true;
    setCloneOrderList([...newArray]);
  };
  return (
    <>
      <Modal
        show={settingToggle}
        onClose={() => {
          closeSettingToggle();
        }}
      >
        <p className="componentTitle orderCompleteTitle">Chỉnh sữa thông tin</p>
        {cloneOrderList ? (
          <div className="orderSettingBox">
            <table className="orderSettingTable">
              <tbody>
                <tr className="orderSettingTableHeader">
                  <th>Bàn</th>
                  <th>Tên món</th>
                  <th>SL</th>
                  <th>Giá</th>
                  <th>Tổng</th>
                  <th>T.Gian</th>
                  {/* <th>Cập nhật</th> */}
                </tr>
                {cloneOrderList.map((el, index) => {
                  return (
                    <>
                      <tr className="orderSettingTableItem">
                        <th>{el.tableName}</th>
                        <th>{el.vietnamese}</th>
                        <th className="orderSettingTableCount">
                          <RemoveIcon
                            fontSize="small"
                            onClick={() => {
                              minusCount(index);
                            }}
                          ></RemoveIcon>
                          {el.count}
                          <AddIcon fontSize="small"></AddIcon>
                        </th>
                        <th className="orderSettingTablePriceChange">
                          <input value={el.price} />
                        </th>
                        <th>{el.newPrice}</th>
                        <th>3 phút trước</th>
                        {/* <th>{el.changeStatus ? "Cập nhật" : ""}</th> */}
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
}
