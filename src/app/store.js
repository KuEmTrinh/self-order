import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/login/loginSlice";
import navigationReducer from "../features/action/component/navigationSlice";
import foodReducer from "../features/action/component/food/foodSlice";
import searchReducer from "../features/action/component/categories/searchSlice";
import historyReducer from "../features/action/component/categories/historySlice";
export const store = configureStore({
  reducer: {
    login: loginReducer,
    navigation: navigationReducer,
    food: foodReducer,
    search: searchReducer,
    histories: historyReducer,
  },
});
