import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  records: [],
  filter: {},
  graphsData: [],
  status: 'idle'
};

export const fetchAsync = createAsyncThunk(
  'covid19/fetchRecords',
  async (data) => {
    const response = await axios({
      method: 'post',
      url: '/api',
      data
    });
    if (response && response.data && response.data.data) {
      return response.data.data;
    }
    throw Error('Invalid response');
  }
);

export const covid19Slice = createSlice({
  name: 'covid19',
  initialState,
  reducers: {
    fetchByFilter: (state, action) => {
      state.records = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.records = action.payload;
        state.graphsData = [{
          graphName: 'recovered',
          title: 'Number of recovered',
          records: action.payload.filter(record => record.sub_series === 'Recovered')
        }, {
          graphName: 'deceased',
          title: 'Number of deceased',
          records: action.payload.filter(record => record.sub_series === 'Deceased')
        }];

        state.recovered = action.payload.filter(record => record.sub_series === 'Recovered')
      });
  },
});

export const { fetchByFilter } = covid19Slice.actions;

export const selectRecords = (state) => state.covid19.records;
export const selectStatus = (state) => state.covid19.status;
export const selectGraphsData = (state) => state.covid19.graphsData;

export default covid19Slice.reducer;