import React, { useEffect, useState } from "react";
import Food from "./food/Food";
import { useSelector } from "react-redux";
import Cart from "./cart/Cart";
import List from "./list/List";
import Error from "./Error";
export default function Main({
  userId,
  tableInfo,
  connectCode,
  tableId,
  paymentStatus,
}) {
  const componentNav = useSelector((state) => state.navigation.data);
  const tableCode = tableInfo.code;
  const code = connectCode;
  const [renderCheck, setRenderCheck] = useState(false);
  useEffect(() => {
    if (code == tableCode) {
      setRenderCheck(true);
    }
  }, []);
  useEffect(() => {
    if (code != tableCode) {
      setRenderCheck(false);
    }
  }, [tableInfo]);
  return (
    <>
      {renderCheck ? (
        <div>
          {componentNav === "List" ? (
            <Food
              userId={userId}
              tableId={tableId}
              paymentStatus={paymentStatus}
            ></Food>
          ) : (
            ""
          )}
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
            <List
              userId={userId}
              tableId={tableId}
              tableInfo={tableInfo}
              paymentStatus={paymentStatus}
            ></List>
          ) : (
            ""
          )}
        </div>
      ) : (
        <Error />
      )}
    </>
  );
}
