import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    user: {
      /*
      username: null,
      accessToken: null,
      refreshToken: null,
      error: null,
      isFetching: false,
      */

      username: JSON.parse(localStorage.getItem("state")) ? JSON.parse(localStorage.getItem("state")).data.user.username : "",
      isFetching: JSON.parse(localStorage.getItem("state")) ? JSON.parse(localStorage.getItem("state")).data.user.isFetching : false,
      error: JSON.parse(localStorage.getItem("state")) ? JSON.parse(localStorage.getItem("state")).data.user.error : null,
      accessToken: JSON.parse(localStorage.getItem("state")) ? JSON.parse(localStorage.getItem("state")).data.user.accessToken : null,
      refreshToken: JSON.parse(localStorage.getItem("state")) ? JSON.parse(localStorage.getItem("state")).data.user.refreshToken : null,
      accessTokenDate: JSON.parse(localStorage.getItem("state")) ? JSON.parse(localStorage.getItem("state")).data.user.accessTokenDate : null,
    },

    tasks: JSON.parse(localStorage.getItem("state")) ? JSON.parse(localStorage.getItem("state")).data.tasks : [],
    categories: JSON.parse(localStorage.getItem("state")) ? JSON.parse(localStorage.getItem("state")).data.categories : [],
  },

  reducers: {
    //****************************************************************************
    //------------------------------------USER------------------------------------
    //****************************************************************************

    login: (state, action) => {
      state.user = {
        username: action.payload.username,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null,
        isFetching: false,
        accessTokenDate: Date.now(),
      };
    },
    updateUser: (state, action) => {
      console.log(action.payload);
      state.user.username = action.payload.userPayload.username;
      state.user.accessToken = action.payload.accessToken;
      state.user.refreshToken = action.payload.refreshToken;
      state.user.accessTokenDate = Date.now();
    },
    updateAccessToken: (state, action) => {
      state.user.accessToken = action.payload;
      state.user.accessTokenDate = Date.now();
    },
    setError: (state, action) => {
      state.user.error = action.payload;
    },
    resetState: (state) => {
      state.user = {
        username: null,
        accessToken: null,
        refreshToken: null,
        error: null,
        isFetching: false,
        accessTokenDate: null,
      };
      state.tasks = [];
      state.categories = [];
    },
    toggleFetchingOn: (state) => {
      state.user.isFetching = true;
    },
    toggleFetchingOff: (state) => {
      state.user.isFetching = false;
    },
    toggleFetching: (state) => {
      state.user.isFetching = !state.isFetching;
    },

    //****************************************************************************
    //------------------------------------TASK------------------------------------
    //****************************************************************************

    addTasks: (state, action) => {
      state.tasks = [];
      action.payload.map((x) => {
        let task = {
          _id: x._id,
          userId: x.userId,
          name: x.name,
          categories: x.categories,
          date: x.date,
          completed: x.completed,
          createdAt: x.createdAt,
          updatedAt: x.updatedAt,
        };
        state.tasks = [...state.tasks, task];
      });
    },

    addTask: (state, action) => {
      let task = {
        _id: action.payload._id,
        userId: action.payload.userId,
        name: action.payload.name,
        categories: action.payload.categories,
        date: action.payload.date,
        completed: action.payload.completed,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
      state.tasks = [...state.tasks, task];
    },

    updateTask: (state, action) => {
      state.tasks.map((x) => {
        if (x._id === action.payload._id) {
          x._id = action.payload._id;
          x.userId = action.payload.userId;
          x.name = action.payload.name;
          x.categories = action.payload.categories;
          x.date = action.payload.date;
          x.completed = action.payload.completed;
          x.createdAt = action.payload.createdAt;
          x.updatedAt = action.payload.updatedAt;
        }
      });
    },

    setTaskComplete: (state, action) => {
      state.tasks.map((x) => {
        if (x._id === action.payload._id) {
          x.completed = action.payload.completed;
        }
      });
    },

    deleteTask: (state, action) => {
      let tasks = [];

      state.tasks.map((x) => {
        if (x._id !== action.payload) {
          tasks = [...tasks, x];
        }
      });
      state.tasks = tasks;
    },

    //****************************************************************************
    //---------------------------------CATEGORIES---------------------------------
    //****************************************************************************

    addCategory: (state, action) => {
      let category = {
        _id: action.payload._id,
        userId: action.payload.userId,
        name: action.payload.name,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
      state.categories = [...state.categories, category];
    },

    assignCategory: (state, action) => {
      state.tasks.map((x) => {
        if (x._id === action.payload.taskId) {
          x.categories = [...x.categories, action.payload.categoryId];
        }
      });
    },

    deleteCategory: (state, action) => {
      let categories = [];

      state.categories.map((x) => {
        if (x._id !== action.payload) {
          categories = [...categories, x];
        }
      });
      state.categories = categories;
    },

    updateCategory: (state, action) => {
      let categories = [];
      state.categories.map((x) => {
        if (x._id !== action.payload._id) {
          categories = [...categories, x];
        }
      });
      let category = {
        _id: action.payload._id,
        userId: action.payload.userId,
        name: action.payload.name,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
      state.categories = [category, ...categories];
    },

    removeCategory: (state, action) => {
      let categories = [];
      state.tasks.map((x) => {
        if (x._id === action.payload.taskId) {
          x.categories.map((category) => {
            if (category !== action.payload.categoryId) {
              categories = [...categories, category];
            }
          });
        }
      });

      let payload = {
        categories: categories,
      };

      function updateState() {
        state.tasks.map((x) => {
          if (x._id === action.payload.taskId) {
            x.categories = categories;
          }
        });
      }

      async function updateDB() {
        try {
          await axios.put(`/users/${state.user.username}/tasks/${action.payload.taskId}`, payload).then(() => {});
        } catch (err) {
          if (err.response?.status === 403) {
            state.user.error = err.response.status;
          }
          console.log(err);
        }
      }

      updateDB();
      updateState();
    },
    addCategories: (state, action) => {
      state.categories = [];
      action.payload.length > 0 &&
        action.payload.map((x) => {
          let category = {
            _id: x._id,
            name: x.name,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
          };
          state.categories = [...state.categories, category];
        });
    },
  },
});

export const {
  login,
  updateUser,
  updateAccessToken,
  setError,
  resetState,
  toggleFetchingOn,
  toggleFetchingOff,
  toggleFetching,
  addTasks,
  addTask,
  updateTask,
  setTaskComplete,
  deleteTask,
  addCategories,
  addCategory,
  assignCategory,
  updateCategory,
  deleteCategory,
  removeCategory,
} = dataSlice.actions;

export default dataSlice.reducer;
