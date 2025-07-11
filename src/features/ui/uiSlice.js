import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  announcements: [
    {
      id: 1,
      message: 'Miễn phí vận chuyển cho đơn hàng trên 500k',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
    },
  ],
  isMenuOpen: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
    addAnnouncement: (state, action) => {
      state.announcements.push(action.payload);
    },
    removeAnnouncement: (state, action) => {
      state.announcements = state.announcements.filter(
        (announcement) => announcement.id !== action.payload
      );
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setMenuOpen, addAnnouncement, removeAnnouncement, setTheme } =
  uiSlice.actions;

export default uiSlice.reducer;
