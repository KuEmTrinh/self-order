import React, { useEffect, useState } from "react";
import Modal from "../../../main/component/menu/Modal";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
export default function OrderSetting({
  settingToggle,
  closeSettingToggle,
  order,
  userId,
}) {
  useEffect(() => {
    const newArray = [...order];
    newArray.map((el) => {
      if (el.details) {
        el.basePrice = el.price;
      }
    });
    setCloneOrderList(order);
  }, [order]);
  const [cloneOrderList, setCloneOrderList] = useState("");
  const [changeData, setChangeData] = useState(false);
  const minusCount = (index) => {
    const newArray = cloneOrderList;
    newArray[index].count -= 1;
    newArray[index].changeStatus = true;
    newArray[index].newPrice -= newArray[index].price;
    setCloneOrderList([...newArray]);
    setChangeData(true);
  };

  const plusCount = (index) => {
    const newArray = cloneOrderList;
    newArray[index].count += 1;
    newArray[index].changeStatus = true;
    newArray[index].newPrice += parseInt(newArray[index].price);
    setCloneOrderList([...newArray]);
    setChangeData(true);
  };
  const changePriceValue = (e, index) => {
    const newArray = cloneOrderList;
    const changeItem = newArray[index];
    changeItem.changeStatus = true;
    changeItem.price = e.target.value;
    changeItem.newPrice = changeItem.count * changeItem.price;
    setCloneOrderList([...newArray]);
    setChangeData(true);
  };
  const saveChangeData = () => {
    cloneOrderList.map((el, index) => {
      if (el.changeStatus) {
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
        const changeStatusQuery = db
          .collection("user")
          .doc(userId)
          .collection("order")
          .doc(el.id)
          .update({
            changeStatus: true,
            price: el.price,
            basePrice: el.price,
            newPrice: el.newPrice,
            count: el.count,
          });
      }
    });
    setChangeData(false);
  };
  return (
    <>
      <Modal
        show={settingToggle}
        onClose={() => {
          closeSettingToggle();
        }}
      >
        <div className="orderBoxIcon">
          <p className="componentTitle">C??i ?????t</p>
          {changeData ? (
            <button className="buttonActive" onClick={saveChangeData}>
              L??u
            </button>
          ) : (
            <button className="buttonDisable">L??u</button>
          )}
        </div>
        <p className="subTitleComponent">
          ??i???u ch???nh th??ng s??? c??c m?? order hi???n t???i
        </p>
        <div className="billBox">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <p className="tableTitle">B??n</p>
                  </TableCell>
                  <TableCell align="right">
                    <p className="tableTitle">T??n m??n</p>
                  </TableCell>
                  <TableCell align="left">
                    <p className="tableTitle">S??? l?????ng</p>
                  </TableCell>
                  <TableCell align="left">
                    <p className="tableTitle">Gi??</p>
                  </TableCell>
                  <TableCell align="right">
                    <p className="tableTitle">T???ng</p>
                  </TableCell>
                  <TableCell align="right">
                    <p className="tableTitle">Th???i gian</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cloneOrderList ? (
                  <>
                    {cloneOrderList.map((row, index) => (
                      <>
                        {row.status == 1 ? (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.tableName}
                            </TableCell>
                            <TableCell align="right">
                              {row.vietnamese}
                            </TableCell>
                            <TableCell align="center">
                              <div className="orderSettingTableCountItem">
                                <div className="orderSettingTableCountIcon">
                                  {row.count > 1 ? (
                                    <div className="tableMinusIcon">
                                      <RemoveIcon
                                        fontSize="small"
                                        onClick={() => {
                                          minusCount(index);
                                        }}
                                        color="action"
                                      ></RemoveIcon>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="orderSettingTableCountNumber">
                                  {row.count}
                                </div>
                                <div className="orderSettingTableCountIcon">
                                  {/* {row.count < row.maxCount ? (
                                    <div className="tablePlusIcon">
                                      <AddIcon
                                        fontSize="small"
                                        onClick={() => {
                                          plusCount(index);
                                        }}
                                        color="action"
                                      ></AddIcon>
                                    </div>
                                  ) : (
                                    ""
                                  )} */}
                                  <div className="tablePlusIcon">
                                    <AddIcon
                                      fontSize="small"
                                      onClick={() => {
                                        plusCount(index);
                                      }}
                                      color="action"
                                    ></AddIcon>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell align="right">
                              <div className="tableInputBox">
                                <TextField
                                  id="outlined-number"
                                  label="Gi??"
                                  type="number"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  size="small"
                                  value={row.price}
                                  onChange={(e) => {
                                    changePriceValue(e, index);
                                  }}
                                />
                              </div>
                            </TableCell>
                            <TableCell align="right">
                              {row.price * row.count}
                            </TableCell>
                            <TableCell align="right">
                              {row.timeDuration}
                            </TableCell>
                          </TableRow>
                        ) : (
                          ""
                        )}
                      </>
                    ))}
                  </>
                ) : (
                  ""
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Modal>
    </>
  );
}
