import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { db } from "../../../../app/firebase";
import { addFoodToCart } from "../food/foodSlice";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function History({ userId, tableId, closeBox }) {
  const dispatch = useDispatch();
  const [historyData, setHistoryData] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  // time duration calcutator function
  const diff = (start, end) => {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0) hours = hours + 24;
    if (hours == 0) {
      if (minutes == 0) {
        return "bây giờ";
      } else {
        return minutes + " phút trước";
      }
    } else {
      return hours + " tiếng " + minutes + " phút trước";
    }
  };
  const toDateTime = (secs) => {
    var time = new Date(1970, 1, 0, 9);
    time.setSeconds(secs);
    let hours = time.getHours();
    let min = time.getMinutes();
    return hours + ":" + min;
  };
  const getCurrentTime = () => {
    let today = new Date();
    let hours = today.getHours();
    let min = today.getMinutes();
    return hours + ":" + min;
  };
  const getTimeDuration = (secs) => {
    let createdAtTime = toDateTime(secs.seconds);
    let currentTime = getCurrentTime();
    let diffTime = diff(createdAtTime, currentTime);
    return diffTime;
  };
  // end
  const addToCart = (index) => {
    setDisableButton(true);
    setTimeout(() => {
      setDisableButton(false);
    }, 1000);
    historyData[index].newPrice = historyData[index].price;
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
      .orderBy("createdAt", "desc")
      .where("tableId", "==", tableId)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.docs.map((doc) => {
          data.push({
            id: doc.data().foodId,
            categoryId: doc.data().categoryId,
            vietnamese: doc.data().vietnamese,
            japanese: doc.data().japanese,
            count: doc.data().count,
            status: doc.data().status,
            imgUrl: doc.data().imgUrl,
            price: doc.data().basePrice,
            newPrice: doc.data().newPrice,
            createdAt: getTimeDuration(doc.data().createdAt),
          });
        });
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
      <div
        className="closeBoxIcon"
        onClick={() => {
          closeBox(false);
        }}
      >
        <CloseIcon fontSize="small" color="action"></CloseIcon>
      </div>
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
                    <p className="historyTime">{el.createdAt}</p>
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
        <Stack sx={{ width: "60%", color: "grey.500" }} spacing={2}>
          <LinearProgress color="inherit" />
        </Stack>
      )}
    </div>
  );
}
