import React from "react";
import "./Modal.css";
import CloseIcon from "@mui/icons-material/Close";
export default function Modal(props) {
  return (
    <>
      {props.show ? (
        <div className="modal">
          <div className="modalContent">{props.children}</div>
          <div className="closeIcon">
            <CloseIcon
              onClick={() => {
                props.onClose();
              }}
            ></CloseIcon>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
