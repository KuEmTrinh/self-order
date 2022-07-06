import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Input from "./Input";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db } from "../../../../../app/firebase";
import { storage } from "../../../../../app/firebase";
export default function Account() {
  const userInfo = JSON.parse(useSelector((state) => state.login.data));
  //useState
  const [file, setFile] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userImage, setUserImage] = useState("");
  const [infoEditToggle, setInfoEditToggle] = useState(false);
  const [resultBox, setResultBox] = useState(false);
  const [percent, setPercent] = useState(0);

  //useEffect
  useEffect(() => {
    queryData();
  }, []);

  //function
  const queryData = () => {
    db.collection("user")
      .doc(userInfo.uid)
      .get()
      .then((snapshot) => {
        let name = snapshot.data().name;
        let phone = snapshot.data().phoneNumber;
        let imageUrl = snapshot.data().photoURL;
        setUserImage(imageUrl);
        setUserName(name);
        if (phone) {
          setUserPhone(phone);
        } else {
          setUserPhone("000-000-0000");
        }
      });
  };
  const handleUpload = () => {
    if (!file) {
      alert("Please choose a file first!");
    }
    setResultBox(true);
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          updateAccountImage(url);
        });
      }
    );
  };
  const updateAccountImage = (url) => {
    db.collection("user").doc(userInfo.uid).update({
      photoURL: url,
    });
  };
  const updateAccount = () => {
    db.collection("user").doc(userInfo.uid).update({
      name: userName,
      phoneNumber: userPhone,
    });
    setInfoEditToggle(false);
  };
  const updateAccountInfomation = () => {
    if (file) {
      handleUpload();
    }
    updateAccount();
    setTimeout(() => {
      queryData();
    }, 2000);
  };
  return (
    <div className="accountSetting">
      <p className="accountSettingTitle">Thông tin cá nhân</p>
      <div className="accountInfomation">
        <div className="accountImage">
          {previewImage === "" ? (
            <img src={userImage}></img>
          ) : (
            <img src={previewImage}></img>
          )}
        </div>
        <div className="wrapCenter">
          <div className="accountInfomationContent">
            <p className="accountInfomationName">{userName}</p>
            <p className="accountInfomationRole">Quản lí</p>
            <p className="accountInfomationPhone">{userPhone}</p>
            {infoEditToggle ? (
              <button
                className="button button-green"
                onClick={() => {
                  updateAccountInfomation();
                }}
              >
                Cập nhật
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <p className="accountSettingTitle">Chỉnh sửa thông tin</p>
      <div className="accountSettingInputBox">
        <Input
          setFile={setFile}
          setPreviewImage={setPreviewImage}
          setUserName={setUserName}
          setUserPhone={setUserPhone}
          setInfoEditToggle={setInfoEditToggle}
          userName={userName}
          userPhone={userPhone}
        ></Input>
      </div>
      <p className="accountSettingTitle">Thông tin tài khoản</p>
      <div className="accountStatusInfomation">
        <div className="accountStatusInfomationActive">
          <CheckCircleIcon color="success"></CheckCircleIcon>
          <p>Đã đăng ký</p>
        </div>
      </div>
    </div>
  );
}
