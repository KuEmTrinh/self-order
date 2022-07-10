import React, { useEffect, useState } from "react";
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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GridViewIcon from "@mui/icons-material/GridView";
import QrItem from "./QrItem";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
export default function TableItem({ tables }) {
  //useState
  const [tableData, setTableData] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [tableIndex, setTableIndex] = useState("");
  const [deleteTableId, setDeleteTableId] = useState("");
  const [deleteTableToggle, setDeleteTableToggle] = useState(false);
  const [deleteTableName, setDeleteTableName] = useState("");
  const [editTableId, setEditTableId] = useState("");
  const [editTableNewName, setEditTableNewName] = useState("");
  const [editTableToggle, setEditTableToggle] = useState(false);
  const [listChangeStatus, setListChangeStatus] = useState(false);
  const [changeView, setChangeView] = useState(false);
  //useEffect
  useEffect(() => {
    setTableData(tables);
    renderDndList();
  }, [tables]);
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
  const editTableChange = (e) => {
    setEditTableNewName(e.target.value);
  };
  const editConfirm = () => {
    const query = db.collection("table").doc(editTableId);
    query.update({
      name: editTableNewName,
    });
    setEditTableToggle(!editTableToggle);
  };
  //function end drag
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tableData);
    const [reorderData] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderData);
    setTableData(items);
    setListChangeStatus(true);
  };
  const saveList = () => {
    saveIndex(tableData);
  };
  const saveIndex = (items) => {
    items.map((el, index) => {
      const query = db.collection("table").doc(el.id);
      query.update({
        index: index,
      });
      return query;
    });
    setListChangeStatus(false);
    // window.location.reload(false);
  };
  const renderDndList = () => {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="table">
          {(provided) => (
            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
              {tableData.map((row, index) => {
                return (
                  <Draggable
                    key={row.id}
                    draggableId={row.id.toString()}
                    index={index}
                    className="rowTableSize"
                  >
                    {(provided) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
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
                          <div
                            className="categoryIcon categoryDeleteIcon"
                            onClick={() => {
                              setEditTableId(row.id);
                              setEditTableToggle(!editTableToggle);
                              setEditTableNewName(row.name);
                            }}
                          >
                            <EditIcon />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </DragDropContext>
    );
  };
  //getData
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
      <Modal
        show={editTableToggle}
        onClose={() => {
          setEditTableToggle(!editTableToggle);
        }}
      >
        <p className="componentTitle">Sửa tên Bàn</p>
        <div className="categoryEditInputBox">
          <input
            className="inputBoxEnter"
            value={editTableNewName}
            onChange={editTableChange}
          />
        </div>
        <div className="cartToggleConfirm">
          <button className="cartConfirmButton" onClick={editConfirm}>
            Xác nhận
          </button>
        </div>
      </Modal>
      <div className="orderBoxIcon">
        <p className="componentTitle categoryList">Danh Sách Bàn</p>
        {listChangeStatus ? (
          <button
            className="button button-green"
            onClick={() => {
              saveList();
            }}
          >
            Lưu
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="orderBoxIcon">
        {changeView ? (
          <div className="tableViewTitle">
            <ListAltIcon color="action" />
            <p className="subTitleComponent">Sắp xếp kiểu danh sách</p>
          </div>
        ) : (
          <div className="tableViewTitle">
            <GridViewIcon color="action" />
            <p className="subTitleComponent">Sắp xếp kiểu in nhanh</p>
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
      {tableData ? (
        <>
          {changeView ? (
            <div className="billBox tableBox">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <p className="tableTitle">Id</p>
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
                  {renderDndList()}
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div className="tableQrPrintList">
              {tableData.map((el) => {
                return <QrItem table={JSON.stringify(el)} />;
              })}
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}
