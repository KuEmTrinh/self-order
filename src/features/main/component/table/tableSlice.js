import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  tableCurrentIndex: "",
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTableCurrentIndex: (state, action) => {
      state.tableCurrentIndex = action.payload;
    },
  },
});

export const { setTableCurrentIndex } = tableSlice.actions;

export default tableSlice.reducer;
