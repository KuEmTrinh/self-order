import React from "react";
import "./Info.css";
import { useSelector } from "react-redux";

export default function Info() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  return (
    <div className="userInfo flex flex-row align-center">
      <p className="name">{userInfomation.displayName}</p>
      <img src={userInfomation.photoURL} className="photo" />
    </div>
  );
}
