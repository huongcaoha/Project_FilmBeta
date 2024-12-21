import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../../apis/instance";

// Async thunk để xử lý login
export const login = createAsyncThunk(
  "users/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await baseUrl.post("/api.myService.com/v1/auth/sign-in", {
        username,
        password,
      });
      return response.data; // Trả về thông tin người dùng
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi đăng nhập! Vui lòng thử lại."
      );
    }
  }
);

// Async thunk để gọi API lấy danh sách người dùng
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await baseUrl.get(
        `/api.myService.com/v1/admin/user?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return rejectWithValue(
        error.response?.data || "Có lỗi xảy ra khi tải dữ liệu."
      );
    }
  }
);

// Slice quản lý state người dùng
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    totalElement: 0,
    currentPage: 0,
    size: 5,
    loading: false,
    error: null,
    currentUser: null, // Thông tin người dùng đăng nhập
  },
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalElement = action.payload.totalElement;
        state.size = action.payload.size;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { changePage, logout } = userSlice.actions;
export default userSlice.reducer;
