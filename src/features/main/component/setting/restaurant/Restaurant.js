import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import imageCompression from "browser-image-compression";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db } from "../../../../../app/firebase";
import { storage } from "../../../../../app/firebase";
export default function Restaurant() {
  // useSelector
  const userInfo = JSON.parse(useSelector((state) => state.login.data));
  // useState
  // const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [resName, setResName] = useState("Tên quán");
  const [resAddress, setResAddress] = useState("Địa chỉ");
  const [resPhone, setResPhone] = useState("Số điện thoại");
  const [resPhotoUrl, setResPhotoUrl] = useState("");
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [resultBox, setResultBox] = useState(false);
  const [preview, setPreview] = useState("");
  const [infoChangeToggle, setInfoChangeToggle] = useState(false);
  // useEffect
  useEffect(() => {
    queryData();
  }, []);

  useEffect(() => {
    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  //function
  const queryData = () => {
    db.collection("user")
      .doc(userInfo.uid)
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
      });
  };
  const resNameChangeValue = (e) => {
    setResName(e.target.value);
    setInfoChangeToggle(true);
  };
  const resAddressChangeValue = (e) => {
    setResAddress(e.target.value);
    setInfoChangeToggle(true);
  };
  const resPhoneChangeValue = (e) => {
    setResPhone(e.target.value);
    setInfoChangeToggle(true);
  };
  const handleChange = async (event) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 400,
      useWebWorker: true,
    };
    try {
      const file = event.target.files[0];
      const compressedFile = await imageCompression(file, options);
      setFile(compressedFile);
      setInfoChangeToggle(true);
    } catch (err) {
      console.log(err);
    }
  };
  const saveResPhotoUrl = (url) => {
    db.collection("user").doc(userInfo.uid).update({
      resPhotoUrl: url,
    });
    setInfoChangeToggle(false);
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
          saveResPhotoUrl(url);
        });
      }
    );
  };
  const updateAccount = () => {
    db.collection("user").doc(userInfo.uid).update({
      resName: resName,
      resAddress: resAddress,
      resPhone: resPhone,
    });
    setInfoChangeToggle(false);
  };
  const updateConfirm = () => {
    if (file) {
      handleUpload();
    }
    updateAccount();
  };
  return (
    <div className="restaurantSetting">
      <p className="accountSettingTitle">Thông tin nhà hàng</p>
      <div className="restaurantInfomation">
        <div className="restaurantImage">
          {preview === "" ? <img src={resPhotoUrl} /> : <img src={preview} />}
        </div>
        <div className="restaurantContent">
          <div className="wrapContent">
            <p className="restaurantName">{resName}</p>
            <p className="restaurantAddress">{resAddress}</p>
            <p className="restaurantPhoneNumber">{resPhone}</p>
            <div className="socialMediaList">
              <div className="socialMediaItem">
                <FacebookIcon></FacebookIcon>
              </div>
              <div className="socialMediaItem">
                <YouTubeIcon></YouTubeIcon>
              </div>
            </div>
            {infoChangeToggle ? (
              <button
                className="button button-green w-medium"
                onClick={() => {
                  updateConfirm();
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
      <p className="accountSettingTitle">Chỉnh sửa thông tin nhà hàng</p>
      <div className="accountSettingInput">
        <div className="accountSettingInputItem">
          <p className="accountSettingInputLabel">Tên nhà hàng</p>
          <input
            className="inputBoxEnter"
            value={resName}
            onChange={resNameChangeValue}
          />
        </div>
        <div className="accountSettingInputItem">
          <p className="accountSettingInputLabel">Địa chỉ</p>
          <input
            className="inputBoxEnter"
            value={resAddress}
            onChange={resAddressChangeValue}
          />
        </div>
      </div>
      <div className="accountSettingInput mt-1">
        <div className="accountSettingInputItem">
          <p className="accountSettingInputLabel">Số điện thoại</p>
          <input
            className="inputBoxEnter"
            value={resPhone}
            onChange={resPhoneChangeValue}
          />
        </div>
        <div className="accountSettingInputItem">
          <p className="accountSettingInputLabel">Ảnh đại diện</p>
          <label for="accountSettingInput">
            <div className="accountSettingInputUpload">
              <FileUploadIcon></FileUploadIcon>
              <p>Chọn ảnh</p>
              <input
                className="inputSetting"
                onChange={handleChange}
                id="accountSettingInput"
                type="file"
              ></input>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
