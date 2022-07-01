import React from "react";

export default function Input() {
  return (
    <div className="accountSettingInput">
      <div className="accountSettingInputItem">
        <p className="accountSettingInputLabel">Tên</p>
        <input className="inputBoxEnter"></input>
      </div>
      <div className="accountSettingInputItem">
        <p className="accountSettingInputLabel">Số điện thoại</p>
        <input className="inputBoxEnter"></input>
      </div>
      <div className="accountSettingInputItem">
        <p className="accountSettingInputLabel">Ảnh đại diện</p>
        <input className="inputBoxEnter" type="file"></input>
      </div>
    </div>
  );
}
