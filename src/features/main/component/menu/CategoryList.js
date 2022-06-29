import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../../app/firebase";
import Modal from "../../../main/component/menu/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
export default function CategoryList({ categoryList }) {
  let navigate = useNavigate();
  const [categoryData, setCategoryData] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState("");
  const [deleteConfirmToggle, setDeleteConfirmToggle] = useState(false);
  const [deleteCategoryName, setDeleteCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editCategoryNewName, setEditCategoryNewName] = useState("");
  const [editCategoryToggle, setEditCategoryToggle] = useState(false);
  const [listChangeStatus, setListChangeStatus] = useState(false);
  //useEffect
  useEffect(() => {
    setCategoryData(categoryList);
  }, [categoryList]);
  //function
  const deleteConfirm = () => {
    const query = db.collection("category").doc(deleteCategoryId);
    query
      .collection("food")
      .get()
      .then((querySnapshot) => {
        try {
          querySnapshot.docs.map((doc) => {
            doc.ref.delete();
          });
        } catch (error) {
          console.log("Không có food để xóa");
        }
      });
    query.delete();
    setDeleteConfirmToggle(!deleteConfirmToggle);
  };
  const editCategoryChange = (e) => {
    setEditCategoryNewName(e.target.value);
  };
  const editConfirm = () => {
    const query = db.collection("category").doc(editCategoryId);
    query.update({
      name: editCategoryNewName,
    });
    setEditCategoryToggle(!editCategoryToggle);
  };
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(categoryData);
    const [reorderData] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderData);
    setCategoryData(items);
    setListChangeStatus(true);
  };
  const saveList = () => {
    saveIndex(categoryData);
  };
  const saveIndex = (items) => {
    items.map((el, index) => {
      const query = db.collection("category").doc(el.id);
      query.update({
        index: index,
      });
      return query;
    });
    setListChangeStatus(false);
    // window.location.reload(false);
  };
  return (
    <>
      <Modal
        show={deleteConfirmToggle}
        onClose={() => {
          setDeleteConfirmToggle(!deleteConfirmToggle);
        }}
      >
        <p className="componentTitle">Xóa {deleteCategoryName} ?</p>
        <div className="cartToggleConfirm">
          <button className="deleteConfirmButton" onClick={deleteConfirm}>
            Xác nhận
          </button>
        </div>
      </Modal>
      <Modal
        show={editCategoryToggle}
        onClose={() => {
          setEditCategoryToggle(!editCategoryToggle);
        }}
      >
        <p className="componentTitle">Sửa tên Danh sách</p>
        <div className="categoryEditInputBox">
          <input
            className="inputBoxEnter"
            value={editCategoryNewName}
            onChange={editCategoryChange}
          />
        </div>
        <div className="cartToggleConfirm">
          <button className="cartConfirmButton" onClick={editConfirm}>
            Xác nhận
          </button>
        </div>
      </Modal>
      <div className="orderBoxIcon">
        <p className="componentTitle categoryList">Danh Sách Danh Mục</p>
        {listChangeStatus ? (
          <button
            className="button confirmButton"
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
      {categoryData ? (
        <div className="billBox">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <p className="tableTitle">Index</p>
                  </TableCell>
                  <TableCell align="right">
                    <p className="tableTitle">Tên danh mục</p>
                  </TableCell>
                  <TableCell align="right">
                    <p className="tableTitle">Danh sách món</p>
                  </TableCell>
                  <TableCell align="right">
                    <p className="tableTitle">Xóa</p>
                  </TableCell>
                  <TableCell align="right">
                    <p className="tableTitle">Sửa</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="category">
                  {(provided) => (
                    <TableBody
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {categoryData.map((row, index) => {
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
                                  <div className="categoryIcon categoryAddIcon">
                                    <ListAltIcon
                                      key={row.id}
                                      onClick={() => {
                                        navigate(`/menu/${row.id}/${row.name}`);
                                      }}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div
                                    className="categoryIcon categoryDeleteIcon"
                                    onClick={() => {
                                      setDeleteCategoryId(row.id);
                                      setDeleteCategoryName(row.name);
                                      setDeleteConfirmToggle(
                                        !deleteConfirmToggle
                                      );
                                    }}
                                  >
                                    <DeleteIcon />
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div
                                    className="categoryIcon categoryDeleteIcon"
                                    onClick={() => {
                                      setEditCategoryId(row.id);
                                      setEditCategoryToggle(
                                        !editCategoryToggle
                                      );
                                      setEditCategoryNewName(row.name);
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
            </Table>
          </TableContainer>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
