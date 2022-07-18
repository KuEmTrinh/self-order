import React, { useState } from "react";
import "./Setting.css";
import Account from "./account/Account";
import Restaurant from "./restaurant/Restaurant";
import Device from "./device/Device";
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
            activeLink === "restaurant"
              ? "settingLinkItem settingLinkItemActive"
              : "settingLinkItem"
          }
          onClick={() => {
            setActiveLink("restaurant");
          }}
        >
          <p>Nhà hàng</p>
        </div>
        <div
          className={
            activeLink === "device"
              ? "settingLinkItem settingLinkItemActive"
              : "settingLinkItem"
          }
          onClick={() => {
            setActiveLink("device");
          }}
        >
          <p>Thiết bị</p>
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
      {activeLink === "restaurant" ? <Restaurant></Restaurant> : ""}
      {activeLink === "device" ? <Device></Device> : ""}
    </>
  );
}
