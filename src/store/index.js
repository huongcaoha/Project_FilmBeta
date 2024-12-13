import { configureStore } from "@reduxjs/toolkit";
import countSlide from "../redux/slices/counterSlice";
import userSlide from "../redux/slices/userSlice";
import screenRoomDetailId from "../redux/slices/screenRoomData";
export const store = configureStore({
  reducer: {
    count: countSlide,
    user: userSlide,
    screenRoomDetail: screenRoomDetailId,
  },
});
