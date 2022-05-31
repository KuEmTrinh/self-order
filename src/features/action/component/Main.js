import React, { useEffect, useState } from "react";
import Food from "./food/Food";
import { useSelector } from "react-redux";
import Cart from "./cart/Cart";
import List from "./list/List";
export default function Main({ userId, tableInfo, connectCode, tableId }) {
  const componentNav = useSelector((state) => state.navigation.data);
  const tableCode = tableInfo.code;
  const code = connectCode;
  const [renderCheck, setRenderCheck] = useState(false);
  useEffect(() => {
    if (code == tableCode) {
      setRenderCheck(true);
    }
  }, []);
  return (
    <>
      {renderCheck ? (
        <div>
          {componentNav === "List" ? <Food userId={userId}></Food> : ""}
          {componentNav === "Dashboard" ? (
            <Cart
              userId={userId}
              tableInfo={tableInfo}
              tableId={tableId}
            ></Cart>
          ) : (
            ""
          )}
          {componentNav === "OrderList" ? (
            <List userId={userId} tableId={tableId}></List>
          ) : (
            ""
          )}
        </div>
      ) : (
        "Day la component sai ma code"
      )}
    </>
  );
}
