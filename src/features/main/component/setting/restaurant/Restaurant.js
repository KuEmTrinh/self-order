import React from "react";
import FacebookIcon from "./icon/facebook_48px.png";
import MessengerIcon from "./icon/messenger_48px.png";
import InstagramIcon from "./icon/instagram_48px.png";
import YoutubeIcon from "./icon/youtube_48px.png";
import Checkbox from "@mui/material/Checkbox";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export default function Restaurant() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <div className="restaurantSetting">
      <p className="accountSettingTitle">Thông tin nhà hàng</p>
      <div className="restaurantInfomation">
        <div className="restaurantImage">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" />
        </div>
        <div className="restaurantContent">
          <div className="wrapContent">
            <p className="restaurantName">Tên nhà hàng</p>
            <p className="restaurantAddress">
              福岡県北九州市小倉北区三萩野１−７−３−４０５
            </p>
            <p className="restaurantPhoneNumber">093-222-444</p>
            <div className="restaurantSocialMediaList">
              <div className="restaurantSocialMediaIcon">
                <img src={FacebookIcon}></img>
                <Checkbox></Checkbox>
              </div>
              <div className="restaurantSocialMediaIcon restaurantSocialMediaIconMessenger">
                <img src={MessengerIcon}></img>
                <Checkbox></Checkbox>
              </div>
              <div className="restaurantSocialMediaIcon">
                <img src={InstagramIcon}></img>
                <Checkbox></Checkbox>
              </div>
              <div className="restaurantSocialMediaIcon restaurantSocialMediaIconMessenger">
                <img src={YoutubeIcon}></img>
                <Checkbox></Checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="accountSettingTitle">Chỉnh sửa thông tin nhà hàng</p>
      <div className="accountSettingInput">
        <div className="accountSettingInputItem">
          <p className="accountSettingInputLabel">Tên nhà hàng</p>
          <input className="inputBoxEnter" />
        </div>
        <div className="accountSettingInputItem">
          <p className="accountSettingInputLabel">Địa chỉ</p>
          <input className="inputBoxEnter" />
        </div>
        <div className="accountSettingInputItem">
          <p className="accountSettingInputLabel">Số điện thoại</p>
          <input className="inputBoxEnter" />
        </div>
        <div className="accountSettingInputItem">
          <p className="accountSettingInputLabel">Ảnh đại diện</p>
          <label for="accountSettingInput">
            <div className="accountSettingInputUpload">
              <FileUploadIcon></FileUploadIcon>
              <p>Chọn ảnh</p>
              <input
                className="inputSetting"
                // onChange={handleChange}
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
