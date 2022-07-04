import React, { useState } from "react";
import "./Setting.css";
import Account from "./account/Account";
export default function Setting() {
  const [activeLink, setActiveLink] = useState("account");
  return (
    <>
      <p className="componentTitle">Cài đặt</p>
      <div className="settingLink">
        <div
          className={
            activeLink === "account"
              ? "settingLinkItem settingLinkItemActive"
              : "settingLinkItem"
          }
          onClick={() => {
            setActiveLink("account");
          }}
        >
          <p>Tài khoản</p>
        </div>
        <div
          className={
            activeLink === "employee"
              ? "settingLinkItem settingLinkItemActive"
              : "settingLinkItem"
          }
          onClick={() => {
            setActiveLink("employee");
          }}
        >
          <p>Nhân viên</p>
        </div>
        <div
          className={
            activeLink === "advertisement"
              ? "settingLinkItem settingLinkItemActive"
              : "settingLinkItem"
          }
          onClick={() => {
            setActiveLink("advertisement");
          }}
        >
          <p>Quảng cáo</p>
        </div>
        <div
          className={
            activeLink === "event"
              ? "settingLinkItem settingLinkItemActive"
              : "settingLinkItem"
          }
          onClick={() => {
            setActiveLink("event");
          }}
        >
          <p>Sự kiện</p>
        </div>
      </div>
      {activeLink === "account" ? <Account></Account> : ""}
    </>
  );
}
