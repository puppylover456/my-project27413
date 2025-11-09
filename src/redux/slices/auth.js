import { createSlice , createAsyncThunk } from "@reduxjs/toolkit"
import axios from '../../axios'
export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (params ) => {
        const { data } =  await axios.post('/auth/login', params, {
        headers: {
            'Cache-Control': 'no-cache' // Отключает кеширование для этого запроса
        }
    });

//Мы получаем данные из форму и передаем в эту функцию, передаем в бэкенд и бэкенд вернет ответ,сохранение в редакс
//async (params ) = берем параметры
//params = хранит email и пароль
    return data; //получаем обьект инф о пользователе
}) //название запроса

const initialState = {
    data: null, //хранение информации о пользователе,
    status: 'loading' //информация о пользователях загружается 

}

const authSlice = createSlice({ //создание слайса
    name: 'auth',
    initialState,
    extraReducers : {
        
                [fetchAuth.pending]: (state) => {
                    state.status = 'loading'; //запрос на авторизация загружается
                    state.data = null //если запрос сделается
                },
                [fetchAuth.fulfilled]: (state,action) => {
                   state.status = 'loaded'; 
                    state.data = action.payload //если запрос выполнился успешно
                },
                [fetchAuth.rejected]: (state) => {
                    state.status = 'error'; 
                    state.data = null //если произошла ошибка
                },
                //информация о пользователя из редакса и сохранение в стэйт
    }
});

export const authReducer = authSlice.reducer //из authSlice вытаскиваем reducer