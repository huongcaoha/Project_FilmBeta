import { createSlice } from "@reduxjs/toolkit";

const screenRoomDetail = createSlice({
  name: "screenRoomDetail",
  initialState: null,
  reducers: {
    saveScreenRoom: (state, action) => {
      return action.payload;
    },
  },
});
export const { saveScreenRoom } = screenRoomDetail.actions;
export default screenRoomDetail.reducer;
