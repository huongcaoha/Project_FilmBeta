import { createAsyncThunk } from "@reduxjs/toolkit";

import Cookies from "js-cookie";
import baseUrl from "../apis/instance";
import { use } from "react";

export const register = (user) => {
  const response = baseUrl2.post("auth/sign-up", user);
  return response;
};

export const login = createAsyncThunk("auth/sign-in", async (user) => {
  const response = await baseUrl2.post(`/auth/sign-in`, user);
  Cookies.set("token", JSON.stringify(response.data));
  return response;
});

/**
 * Hàm lấy dữ liệu từ Cookie và lưu vào redux
 */
export const loadUserFromCookie = createAsyncThunk(
  "auth/loadUserFromCookie",
  async (token) => {
    return token;
  }
);

//Lấy thông tin user
export const getUserLogin = async () => {
  const response = await baseUrl.get(
    "api.myService.com/v1/user/account/getUser"
  );
  return response.data;
};
