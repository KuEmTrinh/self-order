import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Cart.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CartConfirm from "./CartConfirm";
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
      {cartData ? (
        <>
          {/* <p className="componentTitle cartTitle">Danh sách Order</p> */}
          <CartConfirm
            cartData={cartData}
            userId={userId}
            tableInfo={tableInfo}
            tableId={tableId}
          ></CartConfirm>
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
