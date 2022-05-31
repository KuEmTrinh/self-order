import React, { useState } from "react";
import Modal from "../menu/Modal";
import TableQRCode from "./TableQRCode";
export default function TableItem({ tables }) {
  const [openModal, setOpenModal] = useState(false);
  const [tableIndex, setTableIndex] = useState("");
  const printQRCode = (index) => {
    setTableIndex(index);
    setOpenModal(!openModal);
  };
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
      <p className="componentTitle categoryList">Danh Sách Bàn</p>
      <div className="categories">
        {tables.map((element, index) => {
          return (
            <span
              className="categoryItem"
              key={element.id}
              onClick={() => {
                printQRCode(index);
              }}
            >
              {element.name}
            </span>
          );
        })}
      </div>
    </>
  );
}
