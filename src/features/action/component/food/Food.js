import React from "react";
import { db } from "../../../../app/firebase";
import { useEffect, useState } from "react";
import Categories from "../categories/Categories";
export default function Food({ userId }) {
  const uid = userId;
  const [data, setData] = useState("");
  useEffect(() => {
    const query = db
      .collection("category")
      .where("uid", "==", uid)
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
  return <>{data ? <Categories data={data}></Categories> : "Loading"}</>;
}
