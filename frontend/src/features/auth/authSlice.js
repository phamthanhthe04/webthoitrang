import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import {
  removeAuthData,
  getToken,
  saveAuthData,
  getAuthData,
} from '../../utils/auth';

const { token, user } = getAuthData();

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thêm action updateUserProfile
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  user: null,
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeAuthData();
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      //login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const { token, ...user } = action.payload.data;
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        saveAuthData(token, user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi đăng nhập';
      })

      //register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        const { token, ...user } = action.payload.data;
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        saveAuthData(token, user);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi đăng ký';
      })

      //updateProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        //update không trả về token chỉ cần userinfo
        state.user = action.payload.data;
        // Cập nhật lại thông tin người dùng trong localStorage
        const currentAuth = JSON.parse(
          localStorage.getItem('userInfo') || '{}'
        );
        localStorage.setItem('userInfo', JSON.stringify(action.payload.data));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi cập nhật thông tin';
      });
  },
});

export const { logout, clearError, setAuthData } = authSlice.actions; // Export setAuthData
export default authSlice.reducer;
