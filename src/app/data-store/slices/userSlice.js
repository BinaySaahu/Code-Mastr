import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: "",
    name: "",
    image:"",
    description:"",
    email: "",
    solved:[],
    admin:false,
    token:""
  },
  reducers: {
    addUser: (state,action) => {
      state.userId = action.payload.id
      state.name = action.payload.name;
      state.image = action.payload.image;
      state.email = action.payload.email;
      state.solved = action.payload.solved;
      state.admin = action.payload.admin;
      localStorage.setItem("user",JSON.stringify(action.payload));
    },
    setToken:(state,action)=>{
      state.token = action.payload
      localStorage.setItem("token",action.payload);

    }
  },
})

export const { addUser,setToken } = userSlice.actions

export default userSlice.reducer