import React from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
export default function Input({
  setPreviewImage,
  setUserName,
  setUserPhone,
  setInfoEditToggle,
  setFile,
  userName,
  userPhone,
}) {
  //useState
  const [preview, setPreview] = useState();
  const [fileInput, setFileInput] = useState();
  //useEffect
  useEffect(() => {
    if (!fileInput) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(fileInput);
    setPreview(objectUrl);
    setInfoEditToggle(true);
    setPreviewImage(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileInput]);

  //function
  const handleChange = async (event) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 400,
      useWebWorker: true,
    };
    try {
      const file = event.target.files[0];
      const compressedFile = await imageCompression(file, options);
      setFileInput(compressedFile);
      setFile(compressedFile);
    } catch (err) {
      console.log(err);
    }
  };

  const userNameChangeValue = (e) => {
    setUserName(e.target.value);
    setInfoEditToggle(true);
  };
  const userPhoneChangeValue = (e) => {
    setUserPhone(e.target.value);
    setInfoEditToggle(true);
  };
  return (
    <div className="accountSettingInput">
      {/* <img src={preview}></img> */}
      <div className="accountSettingInputItem">
        <p className="accountSettingInputLabel">Tên</p>
        <input
          className="inputBoxEnter"
          onChange={userNameChangeValue}
          value={userName}
        ></input>
      </div>
      <div className="accountSettingInputItem">
        <p className="accountSettingInputLabel">Số điện thoại</p>
        <input
          className="inputBoxEnter"
          onChange={userPhoneChangeValue}
          value={userPhone}
        ></input>
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
  );
}
