import { createSlice } from '@reduxjs/toolkit';
const heroesSlice = createSlice({
  name: 'heroes',
  initialState: {
   APIheroes: []
  },
  reducers: {
    fillHeroes: (state, action) => {
        console.log(action)
      state.APIheroes = action.payload
    }
  },
}) 
export default heroesSlice.reducer;
export const { fillHeroes } = heroesSlice.actions;