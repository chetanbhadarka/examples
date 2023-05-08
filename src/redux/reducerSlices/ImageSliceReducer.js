import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: true,
  data: null,
  error: null,
  pageNo: 1,
};

const imageSliceReducer = createSlice({
  name: 'images',
  initialState,
  reducers: {
    loadImages(state) {
      state.loading = true;
    },
    setImages(state, {payload}) {
      if (payload.data) {
        state.data = payload.data;
        (state.pageNo = 1), (state.loading = false);
      } else if (payload.error) {
        state.error = payload.error;
        state.loading = false;
      } else {
        // console.warn('setImages: ', payload);
      }
    },
    updateImages(state, {payload}) {
      if (payload.data) {
        state.data = [...state.data, ...payload.data];
        state.pageNo = payload.page || state.pageNo;
        state.loading = false;
      } else if (payload.error) {
        state.error = payload.error;
        state.loading = false;
      } else {
        // console.warn('updateImages: ', payload);
      }
    },
  },
});

export default imageSliceReducer.reducer;
export const imageSliceAction = imageSliceReducer.actions;
