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
import Modal from "../../../main/component/menu/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function FoodList({ categoryId, paymentStatus }) {
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
  const [radioList, setRadioList] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [properties, setProperties] = useState("");
  const [countNumber, setCountNumber] = useState(1);
  const [foodPropertyTotalPrice, setFoodPropertyTotalPrice] = useState();
  const [foodBasePrice, setFoodBasePrice] = useState();
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
            createdAt: doc.data().createdAt,
            properties: doc.data().properties,
            categoryId: categoryId,
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
  const openPropertiesBox = (id, index) => {
    let price = foodList[index].price;
    let priceNumber = parseInt(price) * 1;
    setFoodPropertyTotalPrice(priceNumber);
    setFoodBasePrice(priceNumber);
    setShowModal(!showModal);
    const query = db
      .collection("category")
      .doc(categoryId)
      .collection("food")
      .doc(id)
      .collection("radio")
      .get()
      .then((snapshot) => {
        const data = [];
        const properties = [];
        snapshot.docs.map((doc) => {
          properties.push({
            name: doc.data().list[0].name,
            price: doc.data().list[0].price,
            listName: doc.data().name,
          });
          data.push({
            id: doc.id,
            name: doc.data().name,
            list: doc.data().list,
          });
        });
        setProperties(properties);
        console.log(properties);
        setRadioList(data);
      });
  };
  const setFoodProperties = (e, index) => {
    const newArray = JSON.parse(JSON.stringify(properties));
    let name = e.target.value;
    const cloneArray = JSON.parse(JSON.stringify(radioList[index].list));
    const filterItem = cloneArray.filter((item) => item.name === name);
    newArray[index] = {
      name: name,
      price: filterItem[0].price,
      listName: radioList[index].name,
    };
    let foodPropertyPrice = 0;
    newArray.map((el) => (foodPropertyPrice += parseInt(el.price)));
    setFoodPropertyTotalPrice(
      (foodBasePrice + foodPropertyPrice) * countNumber
    );
    setProperties(newArray);
  };
  return (
    <>
      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <p className="subTitleComponent">Tuỳ chọn chi tiết</p>
        <div className="foodRadioList">
          {radioList ? (
            <>
              {radioList.map((el, index) => {
                return (
                  <div className="radioListPreviewBox" key={el.id}>
                    <p className="radioListPreviewTitle">{el.name}</p>
                    <div className="radioPreviewListItem">
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={el.list[0].name}
                        name="radio-buttons-group"
                        onChange={(e) => {
                          setFoodProperties(e, index);
                        }}
                      >
                        {el.list.map((item) => {
                          return (
                            <div className="radioListItem">
                              <FormControlLabel
                                value={item.name}
                                control={<Radio size="small" />}
                                label={item.name}
                                margin="none"
                              />
                              {item.price !== 0 ? (
                                <p
                                  className="radioPriceText"
                                  onChange={(e) => {
                                    console.log(e.target.value);
                                  }}
                                >
                                  ({item.price})
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p className="subTitleComponent">Không có dữ liệu</p>
          )}
        </div>
        <p className="subTitleComponent">Số lượng</p>
        <div className="countSettingBox">
          <div className="countSettingMinusButton">
            {countNumber > 1 ? (
              <RemoveCircleIcon
                onClick={() => {
                  setCountNumber(countNumber - 1);
                  setFoodPropertyTotalPrice(foodBasePrice * (countNumber + 1));
                }}
              ></RemoveCircleIcon>
            ) : (
              <RemoveCircleIcon color="action"></RemoveCircleIcon>
            )}
          </div>
          <div className="countSettingNumber">{countNumber}</div>
          <div className="countSettingMinusButton">
            <AddCircleIcon
              onClick={() => {
                setCountNumber(countNumber + 1);
                setFoodPropertyTotalPrice(foodBasePrice * (countNumber + 1));
              }}
            ></AddCircleIcon>
          </div>
        </div>
        <p className="subTitleComponent">Tổng</p>
        <p>{foodPropertyTotalPrice}</p>
      </Modal>
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
                          <>
                            {el.properties ? (
                              <button
                                className="foodOrderButton"
                                onClick={() => {
                                  openPropertiesBox(el.id, index);
                                }}
                              >
                                Xem
                              </button>
                            ) : (
                              <button
                                className="foodOrderButton"
                                onClick={() => {
                                  addToCart(index);
                                }}
                              >
                                Chọn
                              </button>
                            )}
                          </>
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
