import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavLink.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { authentication } from "../../../app/firebase";
import { signOut } from "firebase/auth";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
export default function NavLink() {
  const [activeLink, setActiveLink] = useState("/");
  const logOut = () => {
    signOut(authentication)
      .then(() => {
        console.log("da dang xuat");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="linkList">
      <Link to="/" className="navlink">
        <div
          className={activeLink == "/" ? "linkItem linkItemActive" : "linkItem"}
          onClick={() => {
            setActiveLink("/");
          }}
        >
          <div className="linkItemIcon">
            <RestaurantMenuIcon
              color={activeLink == "/" ? "" : "action"}
            ></RestaurantMenuIcon>
          </div>
          <p>Order</p>
        </div>
      </Link>
      <Link to="/menu" className="navlink">
        <div
          className={
            activeLink == "menu" ? "linkItem linkItemActive" : "linkItem"
          }
          onClick={() => {
            setActiveLink("menu");
          }}
        >
          <div className="linkItemIcon">
            <MenuBookIcon
              color={activeLink == "menu" ? "" : "action"}
            ></MenuBookIcon>
          </div>
          <p>Thực đơn</p>
        </div>
      </Link>
      <Link to="/table" className="navlink">
        <div
          className={
            activeLink == "table" ? "linkItem linkItemActive" : "linkItem"
          }
          onClick={() => {
            setActiveLink("table");
          }}
        >
          <div className="linkItemIcon">
            <TableRestaurantIcon
              color={activeLink == "table" ? "" : "action"}
            ></TableRestaurantIcon>
          </div>
          <p>Bàn</p>
        </div>
      </Link>
      <Link to="/bill" className="navlink">
        <div
          className={
            activeLink == "bill" ? "linkItem linkItemActive" : "linkItem"
          }
          onClick={() => {
            setActiveLink("bill");
          }}
        >
          <div className="linkItemIcon">
            <PriceCheckIcon
              color={activeLink == "bill" ? "" : "action"}
            ></PriceCheckIcon>
          </div>
          <p>Hoá đơn</p>
        </div>
      </Link>
      <Link to="/method" className="navlink">
        <div
          className={
            activeLink == "method" ? "linkItem linkItemActive" : "linkItem"
          }
          onClick={() => {
            setActiveLink("method");
          }}
        >
          <div className="linkItemIcon">
            <CreditCardIcon
              color={activeLink == "method" ? "" : "action"}
            ></CreditCardIcon>
          </div>
          <p>Phương thức</p>
        </div>
      </Link>
      <Link to="/printer" className="navlink">
        <div
          className={
            activeLink == "printer" ? "linkItem linkItemActive" : "linkItem"
          }
          onClick={() => {
            setActiveLink("printer");
          }}
        >
          <div className="linkItemIcon">
            <PowerSettingsNewIcon
              color={activeLink == "printer" ? "" : "action"}
            ></PowerSettingsNewIcon>
          </div>
          <p>Thông tin</p>
        </div>
      </Link>
      <div className="logout">
        <p className="logOutIcon">
          <LogoutIcon
            onClick={() => {
              logOut();
            }}
            color="action"
          ></LogoutIcon>
        </p>
        <p className="logOutText">
          Đăng xuất
        </p>
      </div>
    </div>
  );
}
