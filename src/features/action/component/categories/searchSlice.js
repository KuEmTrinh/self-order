import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
});

export default searchSlice.reducer;
