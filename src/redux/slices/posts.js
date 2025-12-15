/**
 * Redux Slice для управления постами и тегами
 * 
 * Slice - это часть Redux store, которая содержит:
 * - initialState (начальное состояние)
 * - reducers (синхронные действия)
 * - extraReducers (обработка асинхронных действий)
 * 
 * createAsyncThunk - создает асинхронное действие, которое автоматически
 * генерирует три состояния: pending, fulfilled, rejected
 */
import { createSlice , createAsyncThunk } from "@reduxjs/toolkit"
import axios from '../../axios'

/**
 * Асинхронное действие для загрузки списка постов
 * 
 * createAsyncThunk принимает:
 * 1. Уникальное имя действия ('posts/fetchPosts')
 * 2. Функцию, которая выполняет асинхронный запрос
 * 
 * Автоматически создает три действия:
 * - fetchPosts.pending - запрос начался
 * - fetchPosts.fulfilled - запрос успешно завершен
 * - fetchPosts.rejected - произошла ошибка
 */
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } =  await axios.get('/posts', {
        headers: {
            'Cache-Control': 'no-cache' // Отключает кеширование для этого запроса
        }
    });
    return data; // Возвращаемые данные попадут в action.payload
});

/**
 * Асинхронное действие для загрузки списка тегов
 */
export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
    const { data } =  await axios.get('/tags', {
        headers: {
            'Cache-Control': 'no-cache' // Отключает кеширование для этого запроса
        }
    });
    return data;
}); 

/**
 * Асинхронное действие для удаления поста
 * 
 * @param {string} id - ID поста для удаления
 */
export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
    await axios.delete(`/posts/${id}`, {
        headers: {
            'Cache-Control': 'no-cache' // Отключает кеширование для этого запроса
        }
    });
    return id; // Возвращаем ID для удаления из состояния
}); 

/**
 * Начальное состояние для постов и тегов
 * 
 * status может быть: 'loading', 'loaded', 'error'
 * items - массив данных (постов или тегов)
 */
const initialState = {
    posts: {
        items: [],        // Массив постов
        status: 'loading' // Статус загрузки постов
    },
    tags: {
        items: [],        // Массив тегов
        status: 'loading' // Статус загрузки тегов
    }
}

/**
 * Создание slice для управления постами
 * 
 * extraReducers - обработчики для асинхронных действий (createAsyncThunk)
 * Здесь мы обрабатываем три состояния каждого асинхронного действия:
 * - pending: запрос выполняется
 * - fulfilled: запрос успешно завершен
 * - rejected: произошла ошибка
 */
const postsSlice = createSlice ({
    name: 'posts', // Имя slice (используется в названиях действий)
    initialState,
    reducers: {}, // Синхронные действия (пока не используются)
    extraReducers:{
        // Обработка состояний загрузки постов
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading'; // Устанавливаем статус загрузки
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload; // Сохраняем полученные посты
            state.posts.status = 'loaded'; // Устанавливаем статус успешной загрузки
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error'; // Устанавливаем статус ошибки
        },
        
        // Обработка состояний загрузки тегов
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload; // Сохраняем полученные теги
            state.tags.status = 'loaded';
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },
        
        // Обработка удаления поста
        // Удаляем пост из массива сразу при начале запроса (оптимистичное обновление)
        [fetchRemovePost.pending]: (state, action) => {
            // Фильтруем массив, оставляя только посты, которые НЕ равны удаляемому ID
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
        }
    }
});

// Экспортируем reducer для использования в store
export const postsReducer = postsSlice.reducer