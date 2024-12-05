import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // Đảm bảo import axios

const initialState = {
  // Sửa chính tả
  status: "idle",
  data: [],
  error: null,
};

export const fetchAllUser = createAsyncThunk("user/fetchAllUser", async () => {
  const response = await axios.get(
    "http://localhost:8080/api.myService.com/v1/products"
  );
  return response.data; // Trả về response.data
});

const userSlice = createSlice({
  name: "user",
  initialState, // Sửa chính tả
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchAllUser.fulfilled, (state, action) => {
        state.status = "successfully";
        state.data = action.payload;
      })
      .addCase(fetchAllUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
