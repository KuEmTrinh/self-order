import React from "react";
import { db } from "../../../../app/firebase";
import { useEffect, useState } from "react";
import Categories from "../categories/Categories";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
export default function Food({ userId, tableId, paymentStatus }) {
  const uid = userId;
  const [data, setData] = useState("");
  useEffect(() => {
    const query = db
      .collection("category")
      .where("uid", "==", uid)
      .orderBy("index")
      .onSnapshot((querySnapshot) => {
        const categories = [];
        querySnapshot.docs.map((doc) => {
          categories.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
        setData(categories);
      });
    return query;
  }, []);
  return (
    <>
      {data ? (
        <Categories
          data={data}
          userId={userId}
          tableId={tableId}
          paymentStatus={paymentStatus}
        ></Categories>
      ) : (
        <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
          <LinearProgress color="inherit" />
        </Stack>
      )}
    </>
  );
}
