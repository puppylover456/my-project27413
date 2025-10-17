import {configureStore } from '@reduxjs/toolkit'
import { postsReducer } from './slices/posts';

const Store = configureStore({
    reducer: {
        posts: postsReducer
    }


})
export default store;