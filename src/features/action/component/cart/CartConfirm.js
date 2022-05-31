import React, { useState } from "react";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import { useDispatch } from "react-redux";
import { clearCart } from "../food/foodSlice";
import Modal from "../../../main/component/menu/Modal";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function CartConfirm({ cartData, userId, tableInfo, tableId }) {
  const dispatch = useDispatch();
  //alert
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const [state, setState] = useState({
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal } = state;

  //confirm order
  const [confirmToggle, setConfirmToggle] = useState(false);
  const createOrder = (el) => {
    if (el.newPrice) {
    } else {
      el.newPrice = el.price;
    }
    db.collection("user").doc(userId).collection("order").add({
      tableName: tableInfo.name,
      tableId: tableId,
      vietnamese: el.vietnamese,
      japanese: el.japanese,
      newPrice: el.newPrice,
      price: el.price,
      count: el.count,
      imgUrl: el.imgUrl,
      status: 1,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updateAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    dispatch(clearCart());
  };
  const openModalBox = () => {
    setConfirmToggle(true);
  };
  const orderConfirm = () => {
    setConfirmToggle(false);
    cartData.map((el) => {
      createOrder(el);
    });
    setMessage("Hoàn thành");
    setOpen(true);
  };
  return (
    <>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          key={vertical + horizontal}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: "50%" }}>
            {message}
          </Alert>
        </Snackbar>
      </Stack>
      <Modal
        show={confirmToggle}
        onClose={() => {
          setConfirmToggle(false);
        }}
      >
        <div className="cartToggleConfirm">
          <button className="cartConfirmButton" onClick={orderConfirm}>
            Xác nhận
          </button>
        </div>
      </Modal>
      <div className="cartConfirm">
        {cartData.length > 0 ? (
          <button className="cartConfirmButton" onClick={openModalBox}>
            Order
          </button>
        ) : (
          <button className="cartConfirmButton disableButton">Order</button>
        )}
      </div>
    </>
  );
}
