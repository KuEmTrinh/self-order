import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { db } from "../../../../../app/firebase";
import { firebase } from "../../../../../app/firebase";
import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
export default function Device() {
  //reduxData
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  //useState
  const [deviceName, setDeviceName] = useState("");
  const [deviceList, setDeviceList] = useState("");
  //useEffect
  useEffect(() => {
    fetchData();
  }, []);
  //function
  const fetchData = () => {
    const query = db
      .collection("user")
      .doc(uid)
      .collection("device")
      .orderBy("name");
    query.get().then((snapshot) => {
      const data = [];
      snapshot.docs.map((doc) => {
        data.push({
          id: doc.id,
          name: doc.data().name,
        });
      });
      setDeviceList(data);
    });
  };
  const createDevice = () => {
    const query = db.collection("user").doc(uid).collection("device").add({
      name: deviceName,
      list: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setDeviceName("");
    fetchData();
    return query;
  };
  return (
    <div className="deviceBox">
      <p className="subTitleComponent">Tạo mới thiết bị</p>
      <div className="deviceInputBox">
        <TextField
          id="outlined-name"
          label="Nhập tên thiết bị"
          onChange={(e) => {
            setDeviceName(e.target.value);
          }}
          value={deviceName}
        />
        {deviceName !== "" ? (
          <div
            className="deviceCreateButton"
            onClick={() => {
              createDevice();
            }}
          >
            Tạo
          </div>
        ) : (
          ""
        )}
      </div>
      <p className="subTitleComponent">Danh sách các thiết bị</p>
      <div className="deviceList">
        {deviceList ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <p className="tableTitle">Tên</p>
                  </TableCell>
                  <TableCell align="right">
                    <p className="tableTitle">Sửa</p>
                  </TableCell>
                  <TableCell align="right">
                    <p className="tableTitle">Xóa</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deviceList.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      <EditIcon></EditIcon>
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      <DeleteIcon></DeleteIcon>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          "loading"
        )}
      </div>
    </div>
  );
}
