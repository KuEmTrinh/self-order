import React from "react";
import { Link } from "react-router-dom";
import "./NavLink.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { authentication } from "../../../app/firebase";
import { signOut } from "firebase/auth";
export default function NavLink() {
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
      <div className="linkItem">
        <Link to="/order" className="navlink">
          Order
        </Link>
      </div>
      <div className="linkItem">
        <Link to="/menu" className="navlink">
          Menu
        </Link>
      </div>
      <div className="linkItem">
        <Link to="/table" className="navlink">
          Table
        </Link>
      </div>
      <div className="linkItem">
        <Link to="/bill" className="navlink">
          Bill
        </Link>
      </div>
      <div className="linkItem">
        <Link to="/money" className="navlink">
          Money
        </Link>
      </div>
      <div className="linkItem">
        <Link to="/printer" className="navlink">
          Printer
        </Link>
      </div>
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
