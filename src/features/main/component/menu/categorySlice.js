import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  categoryCurrentIndex: "",
};

export const categorySlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setCategoryCurrentIndex: (state, action) => {
      state.categoryCurrentIndex = action.payload;
    },
  },
});

export const { setCategoryCurrentIndex } = categorySlice.actions;

export default categorySlice.reducer;
