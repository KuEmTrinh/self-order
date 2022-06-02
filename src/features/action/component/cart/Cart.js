import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Cart.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CartConfirm from "./CartConfirm";
import Switch from "@mui/material/Switch";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import AnimateHeight from "react-animate-height";
import {
  deleteFoodCart,
  plusFoodCart,
  minusFoodCart,
  setTotalCart,
} from "../food/foodSlice";
export default function Cart({ userId, tableInfo, tableId }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.food.data);
  const [cartData, setCartData] = useState("");
  const [height, setHeight] = useState(0);
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
  const countPlus = (id) => {
    dispatch(plusFoodCart(id));
  };
  const countMinus = (id) => {
    dispatch(minusFoodCart(id));
  };

  return (
    <>
      <div className="historyCartWrap">
        <AnimateHeight
          className="cartHistoryBox"
          duration={500}
          height={height}
        >
          <div className="cartItem">
            <div className="cartImage">
              <img src="https://firebasestorage.googleapis.com/v0/b/selforder-39140.appspot.com/o/files%2Ft%C3%B4m.jfif?alt=media&token=942ca0af-a75c-43c2-a037-95b4ea90644f" />
            </div>
            <div className="cartItemRight">
              <div className="cartInfomation">
                <p className="cartVietnamese">ABC</p>
                <p className="cartJapanese">EFD</p>
                <p className="cartPrice">1231</p>
              </div>
            </div>
          </div>
        </AnimateHeight>
      </div>
      <div className="cartHistory">
        <ManageSearchIcon
          fontSize="large"
          onClick={() => {
            setHeight(height === 0 ? "auto" : 0);
          }}
        ></ManageSearchIcon>
      </div>
      {cartData ? (
        <>
          <CartConfirm
            cartData={cartData}
            userId={userId}
            tableInfo={tableInfo}
            tableId={tableId}
          ></CartConfirm>
          {/* <div className="cartToggle">
            <p className="cartTitle">Tự động ghép đơn</p>
            <Switch
              checked={combineToggole}
              onChange={() => {
                handleChangeStatus();
              }}
            ></Switch>
          </div> */}
          <div className="cart">
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
          </div>
        </>
      ) : (
        "Loading"
      )}
    </>
  );
}
