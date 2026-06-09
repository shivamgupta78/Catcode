import {createAsyncThunk,createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData,{rejectWithValue})=>{
        try{
            const response = await axiosClient.post('/user/register',userData);
            if(response.data && response.data.token){
                localStorage.setItem('token', response.data.token);
            }
            return response.data.user;
        }catch(error){
           return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);
export const loginUser = createAsyncThunk(
    'auth/login',
    async (Credentials, { rejectWithValue })=>{
        try{
            const response = await axiosClient.post('/user/login', Credentials);
            if(response.data && response.data.token){
                localStorage.setItem('token', response.data.token);
            }
            return response.data.user;
        }catch(error){
           return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const checkAuth = createAsyncThunk(
    'auth/check',
    async ( _, {rejectWithValue})=>{
        try{
            const { data } = await axiosClient.get('user/check');
            return data.user;
        }catch(error){
            return rejectWithValue(error.response?.data || error.message);
        }

    }
);
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, {rejectWithValue})=>{
        try{
            await axiosClient.post('/user/logout');
            localStorage.removeItem('token');
            return null;
        } catch(error){
           return rejectWithValue(error.response?.data || error.message);
            
        }
    }
);

const savedUser = JSON.parse(localStorage.getItem("user")); //new
const initialState ={
    user:savedUser || null,
    isAuthenticated: !!savedUser,
    loading:false,
    error:null,
}
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder
        //for registerUser
        .addCase(registerUser.pending,(state)=>{
            state.loading = true;
            state.error = null;

        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = !!action.payload;
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload)); //new
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload || "Something went Wrong";
            state.isAuthenticated = false;
            state.user = null;
        })
        //for loginUser
         .addCase(loginUser.pending,(state)=>{
            state.loading = true;
            state.error = null;

        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem("user",JSON.stringify(action.payload)); //new
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Something went Wrong";
            state.isAuthenticated = false;
            state.user = null;
        })
        //for checking the Authentication of user
        .addCase(checkAuth.pending,(state)=>{
            state.loading = true;
            state.error = null;
            
        })
        .addCase(checkAuth.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = !!action.payload;
            state.user = action.payload;
            if (action.payload) {
                    localStorage.setItem("user", JSON.stringify(action.payload));
                } //new
        })
        .addCase(checkAuth.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Something went Wrong";
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        })
        //for logout user
        .addCase(logoutUser.pending,(state)=>{
            state.loading = true;
            state.error = null;
            
        })
        .addCase(logoutUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token')
        })
        .addCase(logoutUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Something went Wrong";
            state.isAuthenticated = false;
            state.user = null;
        })

    }
});

export default authSlice.reducer
