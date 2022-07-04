import React from "react";
import "./Info.css";
import { useSelector } from "react-redux";

export default function Info() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  return (
    <div className="userInfo flex flex-row align-center">
      <img src={userInfomation.photoURL} className="photo" />
      <p className="name">{userInfomation.displayName}</p>
    </div>
  );
}
