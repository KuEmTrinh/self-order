import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Navigation.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PaymentsIcon from "@mui/icons-material/Payments";
import { setNavigation } from "./navigationSlice";
import { useDispatch } from "react-redux";
const theme = createTheme({
  palette: {
    grey: {
      // This is green.A700 as hex.
      main: "#A6A6A6",
    },
    black: {
      // This is green.A700 as hex.
      main: "#000",
    },
  },
});
export default function Navigation() {
  const cartCount = useSelector((state) => state.food.data.length);
  const [cartCountNumber, setCartCountNumber] = useState("");
  useEffect(() => {
    setCartCountNumber(cartCount);
  }, [cartCount]);
  const [activeComponent, setActiveComponent] = useState("List");
  const showComponent = (string) => {
    // console.log(string);
    setActiveComponent(string);
    dispatch(setNavigation(string));
  };
  const dispatch = useDispatch();
  return (
    <div className="navigationMenu">
      <div className="iconList">
        <ThemeProvider theme={theme}>
          <div
            onClick={() => {
              showComponent("List");
            }}
            className="navigationIconItem"
          >
            <RestaurantMenuIcon
              color={activeComponent === "List" ? "black" : "grey"}
            ></RestaurantMenuIcon>
            <p className={activeComponent === "List" ? "textBlack" : "textGrey"}>Gọi món</p>
          </div>
          <div
            onClick={() => {
              showComponent("Dashboard");
            }}
            className="cartIcon navigationIconItem"
          >
            {cartCountNumber > 0 ? (
              <p
                className={
                  activeComponent == "Dashboard"
                    ? "cartCountForIcon"
                    : "cartCountForIcon disableBackgroundIcon"
                }
              >
                {cartCountNumber}
              </p>
            ) : (
              ""
            )}
            <ShoppingCartIcon
              color={activeComponent == "Dashboard" ? "black" : "grey"}
            ></ShoppingCartIcon>
            <p className={activeComponent === "Dashboard" ? "textBlack" : "textGrey"}>Đã thêm</p>
          </div>
          <div
            onClick={() => {
              showComponent("OrderList");
            }}
            className="navigationIconItem"
          >
            <PaymentsIcon
              color={activeComponent == "OrderList" ? "black" : "grey"}
            ></PaymentsIcon>
            <p className={activeComponent === "OrderList" ? "textBlack" : "textGrey"}>Thanh toán</p>
          </div>
          <div
            onClick={() => {
              showComponent("Payment");
            }}
            className="navigationIconItem"
          >
            <FormatListBulletedIcon
              color={activeComponent == "Payment" ? "black" : "grey"}
            ></FormatListBulletedIcon>
            <p className={activeComponent === "Payment" ? "textBlack" : "textGrey"}>Tiện ích</p>
          </div>
        </ThemeProvider>
      </div>
    </div>
  );
}
