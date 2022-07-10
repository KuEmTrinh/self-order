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
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PrintIcon from "@mui/icons-material/Print";
import Modal from "../../../main/component/menu/Modal";
import BillDetails from "./BillDetails";
import { green } from "@mui/material/colors";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GridViewIcon from "@mui/icons-material/GridView";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import TableBill from "./TableBill";
export default function Bill() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const uid = userInfomation.uid;
  const [billData, setBillData] = useState("");
  const [detailToggle, setDetailToggle] = useState(false);
  const [billIndex, setBillIndex] = useState("");
  const [billComplete, setBillComplete] = useState(0);
  const [billSales, setBillSales] = useState(0);
  const [billTotal, setBillTotal] = useState(0);
  const [billWaiting, setBillWaiting] = useState(0);
  const [changeView, setChangeView] = useState(false);
  const getDataFromBill = (data) => {
    let billSalesSum = 0;
    let billTotalSum = 0;
    let billWaitingSum = 0;
    let billComplete = 0;
    data.map((el) => {
      billSalesSum += el.total;
      billTotalSum += 1;
      if (el.status == 1) {
        billWaitingSum += 1;
      } else {
        billComplete += 1;
      }
    });
    setBillSales(billSalesSum);
    setBillTotal(billTotalSum);
    setBillWaiting(billWaitingSum);
    setBillComplete(billComplete);
  };
  useEffect(() => {
    const query = db
      .collection("user")
      .doc(uid)
      .collection("bill")
      .orderBy("createdAt", "desc")
      .limit(10)
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
            details: doc.data().details,
          });
        });
        getDataFromBill(data);
        setBillData(data);
      });
    return query;
  }, []);
  // bill details
  const openDetails = (index) => {
    setBillIndex(index);
    setDetailToggle(true);
  };
  return (
    <div className="bill">
      <Modal
        show={detailToggle}
        onClose={() => {
          setDetailToggle(false);
        }}
      >
        <BillDetails
          bill={billData[billIndex]}
          onClose={() => {
            setDetailToggle(false);
          }}
          userId={uid}
        ></BillDetails>
      </Modal>
      <p className="componentTitle">Chỉ Báo</p>
      <div className="totalBox">
        <div className="totalBoxItemLeft">
          <p className="totalBoxItemCount">{billSales}</p>
          <p className="totalBoxItemTitle">Doanh số</p>
        </div>
        <div className="totalBoxItemRight">
          <div className="totalBoxItem">
            <p className="totalBoxItemCount">{billTotal}</p>
            <p className="totalBoxItemTitle">Tổng Số Hoá Đơn</p>
          </div>
          <div className="totalBoxItem">
            <p className="totalBoxItemCount">{billWaiting}</p>
            <p className="totalBoxItemTitle">Đang Chờ</p>
          </div>
          <div className="totalBoxItem">
            <p className="totalBoxItemCount">{billComplete}</p>
            <p className="totalBoxItemTitle">Hoàn Thành</p>
          </div>
        </div>
      </div>
      <p className="componentTitle mt-1">Danh sách Hoá đơn</p>
      <div className="orderBoxIcon">
        {changeView ? (
          <div className="tableViewTitle">
            <GridViewIcon color="action" />
            <p className="subTitleComponent">In hóa đơn theo bàn</p>
          </div>
        ) : (
          <div className="tableViewTitle">
            <ListAltIcon color="action" />
            <p className="subTitleComponent">In hóa đơn theo yêu cầu</p>
          </div>
        )}
        <div
          className={
            changeView
              ? "changeViewIconBox changeViewIconBoxActive"
              : "changeViewIconBox"
          }
          onClick={() => {
            setChangeView(!changeView);
          }}
        >
          <p>Thay đổi</p>
          <ChangeCircleIcon />
        </div>
      </div>
      {billData ? (
        <>
          {changeView ? (
            <TableBill></TableBill>
          ) : (
            <div className="billBox">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <p className="tableTitle">Tên</p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="tableTitle">Tổng Món</p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="tableTitle">Phương thức</p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="tableTitle">Hoá đơn</p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="tableTitle">Tổng</p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="tableTitle">Trạng thái</p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="tableTitle">In</p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billData.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.tableName}
                        </TableCell>
                        <TableCell align="right">{row.totalOrder}</TableCell>
                        <TableCell align="right">{row.method}</TableCell>
                        <TableCell align="right">
                          {row.receipt == 1 ? "Có" : "Không"}
                        </TableCell>
                        <TableCell align="right">{row.total}</TableCell>
                        <TableCell align="right">
                          {row.status == 1 ? (
                            <HourglassBottomIcon color="action" />
                          ) : (
                            <CheckCircleIcon sx={{ color: green[500] }} />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <PrintIcon
                            color="action"
                            onClick={() => {
                              openDetails(index);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
