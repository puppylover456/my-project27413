/**
 * Redux Store - централизованное хранилище состояния приложения
 * 
 * Store объединяет все reducers (редьюсеры) в одно глобальное состояние,
 * которое доступно во всех компонентах приложения через Provider.
 * 
 * Redux Toolkit упрощает создание store и настройку Redux.
 */
import {configureStore } from '@reduxjs/toolkit'
import { postsReducer } from './slices/posts'; // Редьюсер для управления постами и тегами
import { authReducer } from './slices/auth'; // Редьюсер для управления авторизацией

/**
 * Создание и настройка Redux store
 * 
 * reducer - объект, где каждый ключ - это имя части состояния,
 * а значение - соответствующий редьюсер, который управляет этой частью
 */
const store = configureStore({
    reducer: {
        posts: postsReducer, // Состояние постов доступно как state.posts
        auth: authReducer    // Состояние авторизации доступно как state.auth
    }
})

export default store;