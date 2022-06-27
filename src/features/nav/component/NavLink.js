import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavLink.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { authentication } from "../../../app/firebase";
import { signOut } from "firebase/auth";
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
          Order
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
          Thực đơn
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
          Bàn
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
          Hoá đơn
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
          Thanh toán
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
          Thông tin
        </div>
      </Link>
      <div className="logout">
        <LogoutIcon
          onClick={() => {
            logOut();
          }}
        ></LogoutIcon>
      </div>
    </div>
  );
}
