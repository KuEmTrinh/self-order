import React, { useEffect, useState } from "react";
import { db } from "../../../../app/firebase";
import "./FoodList.css";
import { useDispatch, useSelector } from "react-redux";
import { addFoodToCart } from "./foodSlice";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Zoom from "@mui/material/Zoom";
import Box from "@mui/material/Box";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function FoodList({ categoryId }) {
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search.data);
  const searchingStatus = useSelector((state) => state.search.searching);
  const [foodList, setFoodList] = useState("");
  const [searchingFoodList, setSearchingFoodList] = useState("");
  const [mainDataFoodList, setMainDataFoodList] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const addToCart = (index) => {
    setDisableButton(true);
    setTimeout(() => {
      setDisableButton(false);
    }, 1000);
    const sendDataFromFoodList = JSON.stringify(foodList[index]);
    const sendDataFromSearchList = JSON.stringify(searchingFoodList[index]);
    if (searchingStatus == true) {
      dispatch(addFoodToCart(sendDataFromSearchList));
    } else {
      dispatch(addFoodToCart(sendDataFromFoodList));
    }
    setMessage("Đã thêm");
    setOpen(true);
  };
  useEffect(() => {
    setSearchingFoodList(searchData);
    if (searchData.length == 0) {
      setFoodList(mainDataFoodList);
    }
  }, [searchData]);
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
    setShowItem(false);
    const query = db
      .collection("category")
      .doc(categoryId)
      .collection("food")
      .onSnapshot((querySnapshot) => {
        const food = [];
        querySnapshot.docs.map((doc) => {
          food.push({
            id: doc.id,
            vietnamese: doc.data().vietnamese,
            japanese: doc.data().japanese,
            price: doc.data().price,
            imgUrl: doc.data().imgUrl,
            status: doc.data().status,
            createAt: doc.data().createAt,
          });
        });
        setFoodList(food);
        setMainDataFoodList(food);
      });
    setTimeout(() => {
      setShowItem(true);
    }, 150);
    return query;
  }, [categoryId]);
  return (
    <>
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
      {searchingStatus ? (
        <>
          {searchData.length > 0 ? (
            <>
              <p className="searchResultData">
                {searchData.length + " Kết quả"}
              </p>
            </>
          ) : (
            <>
              {searchingStatus ? (
                <p className="searchResultData">Không có kết quả phù hợp</p>
              ) : (
                ""
              )}
            </>
          )}
        </>
      ) : (
        ""
      )}
      {foodList && searchingStatus == false ? (
        <div className="foodOrder">
          {foodList.map((el, index) => {
            return (
              <Zoom in={showItem}>
                <div className="foodOrderItem" key={el.id}>
                  <div className="foodOrderImage">
                    <img src={el.imgUrl} />
                  </div>
                  <div className="foodOrderContent">
                    <div className="foodOrderDetails">
                      <p className="foodOrderVietnamese">{el.vietnamese}</p>
                      <p className="foodOrderJapanese">{el.japanese}</p>
                      <p className="foodOrderPrice">{el.price}</p>
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
                            className="foodOrderButton"
                            onClick={() => {
                              addToCart(index);
                            }}
                          >
                            Chọn
                          </button>
                        ) : (
                          <button className="foodSoldOutButton" disabled>
                            Hết
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Zoom>
            );
          })}
        </div>
      ) : (
        ""
      )}
      {searchingFoodList && searchingStatus == true ? (
        <div className="foodOrder">
          {searchingFoodList.map((el, index) => {
            return (
              <div className="foodOrderItem" key={el.id}>
                <div className="foodOrderImage">
                  <img src={el.imgUrl} />
                </div>
                <div className="foodOrderContent">
                  <div className="foodOrderDetails">
                    <p className="foodOrderVietnamese">{el.vietnamese}</p>
                    <p className="foodOrderJapanese">{el.japanese}</p>
                    <p className="foodOrderPrice">{el.price}</p>
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
                          className="foodOrderButton"
                          onClick={() => {
                            addToCart(index);
                          }}
                        >
                          Chọn
                        </button>
                      ) : (
                        <button className="foodSoldOutButton" disabled>
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
        ""
      )}
    </>
  );
}
