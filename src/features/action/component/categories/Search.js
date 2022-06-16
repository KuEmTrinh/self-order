import React, { useState, useEffect } from "react";
import { db } from "../../../../app/firebase";
import "./Search.css";
import "./History.css";
import History from "./History";
import { useDispatch } from "react-redux";
import HistoryIcon from "@mui/icons-material/History";
import Fade from "@mui/material/Fade";
import { setFoodData, setSearching, removeSearchingData } from "./searchSlice";
export default function Search({ categoryList, categoryId, userId, tableId }) {
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
              data.push(queryData);
            });
          });
        return query;
      };
      fetchFoodData();
    });
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
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
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
            <History userId={userId} tableId={tableId}></History>
          </div>
        </Fade>
      ) : (
        ""
      )}
      <input
        value={keyWord}
        className="searchBoxInput"
        onChange={searchValueChange}
        placeholder="Tìm kiếm"
      ></input>
      <HistoryIcon
        color="action"
        fontSize="large"
        onClick={openHistoryBox}
      ></HistoryIcon>
    </div>
  );
}
