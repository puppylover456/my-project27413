/**
 * Redux Slice для управления авторизацией пользователя
 * 
 * Управляет состоянием авторизации: вход, регистрация, проверка текущего пользователя
 */
import { createSlice , createAsyncThunk } from "@reduxjs/toolkit"
import axios from '../../axios'

/**
 * Асинхронное действие для авторизации (входа) пользователя
 * 
 * @param {Object} params - Объект с данными для входа
 * @param {string} params.email - Email пользователя
 * @param {string} params.password - Пароль пользователя
 * 
 * Отправляет данные на сервер, получает информацию о пользователе и токен
 */
export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
    const { data } = await axios.post('/auth/login', params, {
        headers: {
            'Cache-Control': 'no-cache' // Отключает кеширование для этого запроса
        }
    });
    // Сохраняем токен в localStorage для автоматического добавления в заголовки
    if (data.token) {
        window.localStorage.setItem('token', data.token);
    }
    return data; // Возвращаем объект с информацией о пользователе
});

/**
 * Асинхронное действие для проверки текущего авторизованного пользователя
 * 
 * Используется при загрузке приложения для проверки, авторизован ли пользователь
 * (например, если токен сохранен в localStorage)
 */
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const { data } = await axios.get('/auth/me', {
        headers: {
            'Cache-Control': 'no-cache' // Отключает кеширование для этого запроса
        }
    });
    return data; // Возвращаем объект с информацией о пользователе
});

/**
 * Асинхронное действие для регистрации нового пользователя
 * 
 * @param {Object} params - Объект с данными для регистрации
 * @param {string} params.email - Email пользователя
 * @param {string} params.password - Пароль пользователя
 * @param {string} params.fullName - Полное имя пользователя (если требуется)
 * 
 * Создает нового пользователя и автоматически авторизует его
 */
export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/auth/register', params, {
        headers: {
            'Cache-Control': 'no-cache' // Отключает кеширование для этого запроса
        }
    });
    // Сохраняем токен в localStorage после успешной регистрации
    if (data.token) {
        window.localStorage.setItem('token', data.token);
    }
    return data; // Возвращаем объект с информацией о пользователе
});

/**
 * Начальное состояние авторизации
 * 
 * data: null - означает, что пользователь не авторизован
 * data: {...} - объект с информацией о пользователе (id, email, fullName и т.д.)
 * status: 'loading' | 'loaded' | 'error' - статус загрузки данных авторизации
 */
const initialState = {
    data: null,      // Информация о текущем пользователе (null если не авторизован)
    status: 'loading' // Статус загрузки данных авторизации
}

/**
 * Создание slice для управления авторизацией
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Синхронное действие для выхода из аккаунта
         * 
         * Очищает данные пользователя из состояния и удаляет токен из localStorage
         */
        logout: (state) => {
            state.data = null;
            state.status = 'loaded';
            // Удаляем токен из localStorage при выходе
            window.localStorage.removeItem('token');
        }
    },
    extraReducers: {
        // Обработка состояний авторизации (входа)
        [fetchAuth.pending]: (state) => {
            state.status = 'loading'; // Запрос на авторизацию выполняется
            state.data = null; // Очищаем данные на время загрузки
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.status = 'loaded'; // Авторизация успешна
            state.data = action.payload; // Сохраняем данные пользователя
        },
        [fetchAuth.rejected]: (state) => {
            state.status = 'error'; // Произошла ошибка при авторизации
            state.data = null; // Данные пользователя не загружены
        },
        
        // Обработка состояний проверки текущего пользователя
        [fetchAuthMe.pending]: (state) => {
            state.status = 'loading';
            state.data = null;
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.data = action.payload; // Сохраняем данные текущего пользователя
        },
        [fetchAuthMe.rejected]: (state) => {
            state.status = 'error';
            state.data = null; // Пользователь не авторизован или токен недействителен
        },
        
        // Обработка состояний регистрации
        [fetchRegister.pending]: (state) => {
            state.status = 'loading';
            state.data = null;
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.data = action.payload; // Сохраняем данные зарегистрированного пользователя
        },
        [fetchRegister.rejected]: (state) => {
            state.status = 'error';
            state.data = null; // Регистрация не удалась
        }
    }
});

/**
 * Селектор для проверки, авторизован ли пользователь
 * 
 * @param {Object} state - Состояние Redux store
 * @returns {boolean} - true если пользователь авторизован, false если нет
 * 
 * Использование: const isAuth = useSelector(selectIsAuth);
 */
export const selectIsAuth = (state) => Boolean(state.auth.data);

// Экспортируем reducer для использования в store
export const authReducer = authSlice.reducer;

// Экспортируем действия (actions) для использования в компонентах
export const { logout } = authSlice.actions;