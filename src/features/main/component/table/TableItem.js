import React, { useState } from "react";
import Modal from "../menu/Modal";
import TableQRCode from "./TableQRCode";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import QrCodeIcon from "@mui/icons-material/QrCode";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { db } from "../../../../app/firebase";
export default function TableItem({ tables }) {
  //useState
  const [openModal, setOpenModal] = useState(false);
  const [tableIndex, setTableIndex] = useState("");
  const [deleteTableId, setDeleteTableId] = useState("");
  const [deleteTableToggle, setDeleteTableToggle] = useState(false);
  const [deleteTableName, setDeleteTableName] = useState("");
  const [editTableId, setEditTableId] = useState("");
  const [editTableNewName, setEditTableNewName] = useState("");
  const [editTableToggle, setEditTableToggle] = useState(false);
  //useEffect

  //Function
  //Function qr code print
  const printQRCode = (index) => {
    setTableIndex(index);
    setOpenModal(!openModal);
  };
  //Function table delete confirm
  const deleteConfirm = () => {
    const query = db.collection("table").doc(deleteTableId);
    query.delete();
    setDeleteTableToggle(!deleteTableToggle);
  };
  //Function edit
  return (
    <>
      <Modal
        show={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <TableQRCode table={JSON.stringify(tables[tableIndex])}></TableQRCode>
      </Modal>
      <Modal
        show={deleteTableToggle}
        onClose={() => {
          setDeleteTableToggle(!deleteTableToggle);
        }}
      >
        <p className="componentTitle">Xóa {deleteTableName} ?</p>
        <div className="cartToggleConfirm">
          <button className="deleteConfirmButton" onClick={deleteConfirm}>
            Xác nhận
          </button>
        </div>
      </Modal>
      <p className="componentTitle categoryList">Danh Sách Bàn</p>
      <div className="billBox">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <p className="tableTitle">Index</p>
                </TableCell>
                <TableCell align="right">
                  <p className="tableTitle">Tên bàn</p>
                </TableCell>
                <TableCell align="right">
                  <p className="tableTitle">Mã Qr</p>
                </TableCell>
                <TableCell align="right">
                  <p className="tableTitle">Xóa</p>
                </TableCell>
                <TableCell align="right">
                  <p className="tableTitle">Sửa</p>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tables ? (
                <>
                  {tables.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index}
                      </TableCell>
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="right">
                        <div
                          className="categoryIcon tableQrCodeIcon"
                          key={row.id}
                          onClick={() => {
                            printQRCode(index);
                          }}
                        >
                          <QrCodeIcon></QrCodeIcon>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <div
                          className="categoryIcon categoryDeleteIcon"
                          onClick={() => {
                            setDeleteTableId(row.id);
                            setDeleteTableToggle(!deleteTableToggle);
                            setDeleteTableName(row.name);
                          }}
                        >
                          <DeleteIcon />
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <div className="categoryIcon categoryDeleteIcon">
                          <EditIcon />
                        </div>
                      </TableCell>
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
    </>
  );
}
