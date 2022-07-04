import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Input from "./Input";
export default function Account() {
  return (
    <div className="accountSetting">
      <p className="accountSettingTitle">Thông tin cá nhân</p>
      <div className="accountInfomation">
        <div className="accountImage">
          <img src="https://images.unsplash.com/photo-1656682938727-b1ff06e48f63?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"></img>
        </div>
        <div className="wrapCenter">
          <div className="accountInfomationContent">
            <p className="accountInfomationName">Võ Đại Trình</p>
            <p className="accountInfomationRole">Quản lí</p>
            <p className="accountInfomationPhone">0805-653-6269</p>
          </div>
        </div>
      </div>
      <p className="accountSettingTitle">Chỉnh sửa thông tin</p>
      <div className="accountSettingInputBox">
        <Input></Input>
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
