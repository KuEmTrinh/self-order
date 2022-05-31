import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Bill.css";
import { db } from "../../../../app/firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Bill() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [billData, setBillData] = useState("");
  useEffect(() => {
    const query = db
      .collection("user")
      .doc(uid)
      .collection("bill")
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            createdAt: doc.data().createdAt,
            method: doc.data().method,
            receipt: doc.data().receipt,
            status: doc.data().status,
            tableId: doc.data().tableId,
            tableName: doc.data().tableName,
            total: doc.data().total,
            totalOrder: doc.data().totalOrder,
            complete: doc.data().complete,
            cancel: doc.data().cancel,
          });
        });
        setBillData(data);
        console.log(data);
      });
    return query;
  }, []);
  return (
    <div className="bill">
      <p className="componentTitle">Chỉ Báo Hoá Đơn</p>
      <div className="totalBox">
        <div className="totalBoxItemLeft">
          <p className="totalBoxItemCount">1</p>
          <p className="totalBoxItemTitle">Doanh số</p>
        </div>
        <div className="totalBoxItemRight">
          <div className="totalBoxItem">
            <p className="totalBoxItemCount">1</p>
            <p className="totalBoxItemTitle">Tổng Số Hoá Đơn</p>
          </div>
          <div className="totalBoxItem">
            <p className="totalBoxItemCount">1</p>
            <p className="totalBoxItemTitle">Đang Chờ</p>
          </div>
          <div className="totalBoxItem">
            <p className="totalBoxItemCount">1</p>
            <p className="totalBoxItemTitle">Hoàn Thành</p>
          </div>
        </div>
      </div>
      <p className="componentTitle mt-1">Danh sách Hoá đơn</p>
      <div className="billBox">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell align="right">Tổng Món</TableCell>
                <TableCell align="right">Phương thức</TableCell>
                <TableCell align="right">Hoá đơn</TableCell>
                <TableCell align="right">Tổng Tiền</TableCell>
                <TableCell align="right">Trạng thái</TableCell>
                <TableCell align="right">In</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billData ? (
                <>
                  {billData.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.tableName}
                      </TableCell>
                      <TableCell align="right">{row.totalOrder}</TableCell>
                      <TableCell align="right">{row.method}</TableCell>
                      <TableCell align="right">{row.receipt == 1 ? "Có" : "Không"}</TableCell>
                      <TableCell align="right">{row.total}</TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                      <TableCell align="right">In</TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                ""
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
