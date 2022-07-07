import React, { useState, useEffect } from "react";
import "./Info.css";
import { db } from "../../../../app/firebase";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
export default function Info({ userId }) {
  // usetState
  const [resName, setResName] = useState("Chưa cập nhật");
  const [resAddress, setResAddress] = useState("Chưa cập nhật");
  const [resPhone, setResPhone] = useState("Chưa cập nhật");
  const [resPhotoUrl, setResPhotoUrl] = useState("");
  const [copiedContent, setCopiedContent] = useState("");
  const [userPhotoUrl, setUserPhotoUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  //useEffect
  useEffect(() => {
    queryData();
  }, []);
  //function
  const queryData = () => {
    db.collection("user")
      .doc(userId)
      .get()
      .then((snapshot) => {
        let data = snapshot.data();
        if (data.resName) {
          setResName(data.resName);
        }
        if (data.resAddress) {
          setResAddress(data.resAddress);
        }
        if (data.resPhone) {
          setResPhone(data.resPhone);
        }
        if (data.resPhotoUrl) {
          setResPhotoUrl(data.resPhotoUrl);
        }
        if (data.photoURL) {
          setUserPhotoUrl(data.photoURL);
        }
        if (data.name) {
          setUserName(data.name);
        }
        if (data.phoneNumber) {
          setUserPhone(data.phoneNumber);
        }
      });
  };
  return (
    <div className="resInfo">
      <p className="resInfoTitle">Thông tin nhà hàng</p>
      <div className="resImage">
        <img src={resPhotoUrl}></img>
      </div>
      <div className="resInfoContent">
        <p className="resInfoLabel">Tên nhà hàng</p>
        <div className="resInfoBox">
          <p className="resInfoText">{resName}</p>
          <div
            className="resCopyIconBox"
            onClick={() => {
              navigator.clipboard.writeText(resName);
              setCopiedContent("resName");
            }}
          >
            <div className="resCopyIcon">
              <ContentCopyIcon
                fontSize="15px"
                color={copiedContent === "resName" ? "action" : ""}
              />
            </div>
            {copiedContent === "resName" ? (
              <p className="greyText">Đã Copy</p>
            ) : (
              <p>Copy</p>
            )}
          </div>
        </div>
      </div>
      <div className="resInfoContent">
        <p className="resInfoLabel">Địa chỉ</p>
        <div className="resInfoBox">
          <p className="resInfoText">{resAddress}</p>
          <div
            className="resCopyIconBox"
            onClick={() => {
              navigator.clipboard.writeText(resAddress);
              setCopiedContent("resAddress");
            }}
          >
            <div className="resCopyIcon">
              <ContentCopyIcon
                fontSize="15px"
                color={copiedContent === "resAddress" ? "action" : ""}
              />
            </div>
            {copiedContent === "resAddress" ? (
              <p className="greyText">Đã Copy</p>
            ) : (
              <p>Copy</p>
            )}
          </div>
        </div>
      </div>
      <div className="resInfoContent">
        <p className="resInfoLabel">Số điện thoại</p>
        <div
          className="resInfoBox"
          onClick={() => {
            navigator.clipboard.writeText(resPhone);
            setCopiedContent("resPhone");
          }}
        >
          <p className="resInfoText">{resPhone}</p>
          <div className="resCopyIconBox">
            <div className="resCopyIcon">
              <ContentCopyIcon
                fontSize="15px"
                color={copiedContent === "resPhone" ? "action" : ""}
              />
            </div>
            {copiedContent === "resPhone" ? (
              <p className="greyText">Đã Copy</p>
            ) : (
              <p>Copy</p>
            )}
          </div>
        </div>
      </div>
      <p className="resInfoTitle mt-2">Nhân viên</p>
      <div className="accountInfomation mt-1">
        <div className="accountImage">
          <img src={userPhotoUrl}></img>
        </div>
        <div className="wrapCenter">
          <div className="accountInfomationContent ">
            <p className="accountInfomationName">{userName}</p>
            <p className="accountInfomationRole">Quản lí</p>
            <p className="accountInfomationPhone">{userPhone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
