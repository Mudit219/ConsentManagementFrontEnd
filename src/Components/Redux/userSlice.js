import {createSlice} from '@reduxjs/toolkit';

const initialState = { user: null } 
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state,action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        }
    }
});
// console.log("Came till this file",userSlice)

export const {login,logout} = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;