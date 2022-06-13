import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { db } from "../../../../app/firebase";
import { addFoodToCart } from "../food/foodSlice";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function History({ userId, tableId }) {
  const dispatch = useDispatch();
  const [historyData, setHistoryData] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const addToCart = (index) => {
    setDisableButton(true);
    setTimeout(() => {
      setDisableButton(false);
    }, 1000);
    const sendDataFromHistoryList = JSON.stringify(historyData[index]);
    dispatch(addFoodToCart(sendDataFromHistoryList));
    setMessage("Đã thêm");
    setOpen(true);
  };
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
  useEffect(() => {
    const query = db
      .collection("user")
      .doc(userId)
      .collection("order")
      .where("tableId", "==", tableId)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.docs.map((doc) => {
          data.push({
            id: doc.data().foodId,
            vietnamese: doc.data().vietnamese,
            japanese: doc.data().japanese,
            count: doc.data().count,
            status: doc.data().status,
            imgUrl: doc.data().imgUrl,
            price: doc.data().price,
            newPrice: doc.data().newPrice,
          });
        });
        console.log(data);
        setHistoryData(data);
      });
    return query;
  }, []);
  return (
    <div className="historyBoxContent">
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={1000}
          onClose={handleClose}
          key={vertical + horizontal}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: "50%" }}>
            {message}
          </Alert>
        </Snackbar>
      </Stack>
      <p className="componentTitle">Lịch sử gọi món</p>
      {historyData ? (
        <div className="historyList">
          {historyData.map((el, index) => {
            return (
              <div className="historyItem" key={index}>
                <div className="historyImage">
                  <img src={el.imgUrl} />
                </div>
                <div className="historyItemRight">
                  <div className="historyInfomation">
                    <p className="historyVietnamese">{el.vietnamese}</p>
                    <p className="historyJapanese">{el.japanese}</p>
                    <p className="historyPrice">{el.price}</p>
                  </div>
                  {disableButton ? (
                    <button className="foodOrderButton disableButton">
                      <Box sx={{ display: "flex" }}>
                        <CircularProgress size="1.5rem" />
                      </Box>
                    </button>
                  ) : (
                    <>
                      {el.status ? (
                        <button
                          className="historyButton"
                          onClick={() => {
                            addToCart(index);
                          }}
                        >
                          Chọn
                        </button>
                      ) : (
                        <button
                          className="historyButton historyDisableButton"
                          disabled
                        >
                          Hết
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        "Loading"
      )}
    </div>
  );
}
