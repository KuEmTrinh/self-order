import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./Search.css";
import "./History.css";
import History from "./History";
import { useDispatch } from "react-redux";
import HistoryIcon from "@mui/icons-material/History";
import Fade from "@mui/material/Fade";
import { setFoodData, setSearching, removeSearchingData } from "./searchSlice";
export default function Search({
  categoryList,
  categoryId,
  userId,
  tableId,
  paymentStatus,
}) {
  const theme = createTheme({
    palette: {
      grey: {
        // This is green.A700 as hex.
        main: "#A6A6A6",
      },
      black: {
        // This is green.A700 as hex.
        main: "#000",
      },
      white: {
        main: "#fff",
      },
    },
  });
  const dispatch = useDispatch();
  const [foods, setFoods] = useState([]);
  const [keyWord, setKeyWord] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setKeyWord("");
    dispatch(removeSearchingData());
  }, [categoryId]);
  useEffect(() => {
    const data = [];
    categoryList.map((el) => {
      const categoryId = el.id;
      const fetchFoodData = async () => {
        const query = await db
          .collection("category")
          .doc(el.id)
          .collection("food")
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs.map((el) => {
              let queryData = el.data();
              queryData.id = el.id;
              queryData.categoryId = categoryId;
              data.push(queryData);
            });
          });
        return query;
      };
      fetchFoodData();
    });
    console.log(data);
    setFoods(data);
  }, []);
  const searchData = (keyWord) => {
    const resultData = [];
    foods.map((el, index) => {
      const vietnameseString = convertStringData(el.vietnamese).toLowerCase();
      const convertKeyWord = convertStringData(keyWord).toLowerCase();
      const result = vietnameseString.search(convertKeyWord);
      if (result >= 0 && keyWord != "") {
        resultData.push(foods[index]);
      }
    });
    dispatch(setFoodData(JSON.parse(JSON.stringify(resultData))));
    // console.log(resultData);
  };
  const searchValueChange = (e) => {
    if (e.target.value != "") {
      dispatch(setSearching(true));
    } else {
      dispatch(setSearching(false));
    }
    setKeyWord(e.target.value);
    searchData(e.target.value);
  };
  const convertStringData = (str) => {
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
    str = str.replace(/??|??|???|???|??/g, "I");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
    str = str.replace(/???|??|???|???|???/g, "Y");
    str = str.replace(/??/g, "D");
    return str;
  };

  // History Box
  const openHistoryBox = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="searchBox">
      {isOpen ? (
        <Fade in={isOpen}>
          <div className="historyBox">
            <div className="historyBoxOpacity"></div>
            <History
              userId={userId}
              tableId={tableId}
              closeBox={setIsOpen}
            ></History>
          </div>
        </Fade>
      ) : (
        ""
      )}
      <input
        value={keyWord}
        className="searchBoxInput"
        onChange={searchValueChange}
        placeholder="T??m ki???m"
      ></input>
      {paymentStatus ? (
        ""
      ) : (
        <div className="historyOpenIcon" onClick={openHistoryBox}>
          <ThemeProvider theme={theme}>
            <p>Xem</p>
            <HistoryIcon color="white" fontSize="large"></HistoryIcon>
          </ThemeProvider>
        </div>
      )}
    </div>
  );
}
