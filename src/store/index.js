import { configureStore } from "@reduxjs/toolkit";
import countSlide from "../redux/slices/counterSlice";
import screenRoomDetailId from "../redux/slices/screenRoomData";
import userSlide from "../redux/slices/userSlice";
export const store = configureStore({
  reducer: {
    count: countSlide,
    user: userSlide,
    screenRoomDetail: screenRoomDetailId,
  },
});
