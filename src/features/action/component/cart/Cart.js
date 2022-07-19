import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Cart.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CartConfirm from "./CartConfirm";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import {
  deleteFoodCart,
  plusFoodCart,
  minusFoodCart,
  setTotalCart,
  minusSpecialFood,
  plusSpecialFood,
  deleteSpecialFood,
} from "../food/foodSlice";
export default function Cart({ userId, tableInfo, tableId }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.food.data);
  const specialData = useSelector((state) => state.food.specialData);
  const [cartData, setCartData] = useState("");
  const [specialCartData, setSpecialCartData] = useState("");
  const deleteCartItem = (id) => {
    dispatch(deleteFoodCart(id));
  };
  useEffect(() => {
    const cloneCartData = [...data];
    const newArray = JSON.parse(JSON.stringify(cloneCartData));
    for (let i = 0; i < newArray.length; i++) {
      let firstLoopItem = newArray[i];
      for (let j = i + 1; j < newArray.length; j++) {
        if (firstLoopItem.id == newArray[j].id) {
          newArray[i].count += 1;
          newArray[i].newPrice = newArray[i].price * newArray[i].count;
          newArray.splice(j, 1);
          j -= 1;
        }
      }
    }
    function compare(a, b) {
      if (a.vietnamese < b.vietnamese) {
        return -1;
      }
      if (a.vietnamese > b.vietnamese) {
        return 1;
      }
      return 0;
    }
    let total = 0;
    newArray.map((el) => {
      if (el.newPrice) {
        total += parseInt(el.newPrice);
      } else {
        total += parseInt(el.price);
      }
    });
    newArray.sort(compare);
    dispatch(setTotalCart(total));
    setCartData(newArray);
  }, [data]);
  useEffect(() => {
    const newData = [...specialData];
    setSpecialCartData(newData);
  }, [specialData]);
  const countPlus = (id) => {
    dispatch(plusFoodCart(id));
  };
  const countMinus = (id) => {
    dispatch(minusFoodCart(id));
  };

  return (
    <div className="cart">
      <CartConfirm
        cartData={cartData}
        userId={userId}
        tableInfo={tableInfo}
        tableId={tableId}
        specialCartData={specialCartData}
      ></CartConfirm>
      {cartData ? (
        <>
          <>
            {cartData.map((el, index) => {
              return (
                <div className="cartItem" key={index}>
                  <div
                    className="cartItemDelete"
                    onClick={() => {
                      deleteCartItem(el.id);
                    }}
                  >
                    <HighlightOffIcon
                      fontSize="medium"
                      style={{ color: "#c43c35" }}
                    ></HighlightOffIcon>
                  </div>
                  <div className="cartImage">
                    <img src={el.imgUrl} />
                  </div>
                  <div className="cartItemRight">
                    <div className="cartInfomation">
                      <p className="cartVietnamese">{el.vietnamese}</p>
                      <p className="cartJapanese">{el.japanese}</p>
                      <p className="cartPrice">
                        {el.newPrice ? el.newPrice : el.price}
                      </p>
                    </div>
                    <div className="cartCount flex align-center">
                      {el.count > 1 ? (
                        <div
                          className="cartCountMinus"
                          onClick={() => {
                            countMinus(el.id);
                          }}
                        >
                          <RemoveIcon></RemoveIcon>
                        </div>
                      ) : (
                        ""
                      )}

                      <p className="cartCountNumber">{el.count}</p>
                      <div
                        className="cartCountPlus"
                        onClick={() => {
                          countPlus(el.id);
                        }}
                      >
                        <AddIcon></AddIcon>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        </>
      ) : (
        <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
          <LinearProgress color="inherit" />
        </Stack>
      )}
      {specialCartData ? (
        <>
          <>
            {specialCartData.map((el, index) => {
              return (
                <div className="cartItem" key={index}>
                  <div
                    className="cartItemDelete"
                    onClick={() => {
                      dispatch(deleteSpecialFood(index));
                    }}
                  >
                    <HighlightOffIcon
                      fontSize="medium"
                      style={{ color: "#c43c35" }}
                    ></HighlightOffIcon>
                  </div>
                  <div className="cartImage">
                    <img src={el.imgUrl} />
                  </div>
                  <div className="cartItemRight">
                    <div className="cartInfomation">
                      <p className="cartVietnamese">{el.vietnamese}</p>
                      <p className="cartJapanese">{el.japanese}</p>
                      <p className="cartPrice">{el.total}</p>
                      <div className="propertyDetailsBox">
                        {el.details ? (
                          <>
                            {el.details.map((item) => {
                              return (
                                <span className="propertyDetailsItem">
                                  {item}
                                </span>
                              );
                            })}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="cartCount flex align-center">
                      {el.countNumber > 1 ? (
                        <div
                          className="cartCountMinus"
                          onClick={() => {
                            dispatch(minusSpecialFood(index));
                          }}
                        >
                          <RemoveIcon></RemoveIcon>
                        </div>
                      ) : (
                        ""
                      )}

                      <p className="cartCountNumber">{el.countNumber}</p>
                      <div
                        className="cartCountPlus"
                        onClick={() => {
                          dispatch(plusSpecialFood(index));
                        }}
                      >
                        <AddIcon></AddIcon>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        </>
      ) : (
        <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
          <LinearProgress color="inherit" />
        </Stack>
      )}
    </div>
  );
}
