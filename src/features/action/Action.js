import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../app/firebase";
import Navigation from "./component/Navigation";
import Main from "./component/Main";
export default function Action() {
  const params = useParams();
  const [tableInfo, setTableInfo] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const query = await db.collection("table").doc(params?.id);
      const observer = query.get().then((querySnapshot) => {
        setTableInfo(querySnapshot.data());
      });
      return observer;
    };
    fetchData();
  }, []);
  return (
    <>
      <Navigation></Navigation>
      {tableInfo ? (
        <Main
          userId={tableInfo.uid}
          tableInfo={tableInfo}
          connectCode={params?.code}
          tableId={params?.id}
        ></Main>
      ) : (
        ""
      )}
    </>
  );
}
