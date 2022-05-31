import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUserInfomation: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setUserInfomation } = loginSlice.actions;

export default loginSlice.reducer;
