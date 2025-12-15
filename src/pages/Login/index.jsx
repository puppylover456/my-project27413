/**
 * Страница авторизации (входа) пользователя
 * 
 * Использует react-hook-form для управления формой и валидации.
 * После успешной авторизации:
 * - Сохраняет токен в localStorage
 * - Перенаправляет на главную страницу
 * 
 * Если пользователь уже авторизован, автоматически перенаправляет на главную.
 */
import React from "react";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from 'react-redux'; // Для работы с Redux
import { Navigate } from "react-router-dom"; // Для программного перенаправления
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./Login.module.scss";

import { useForm } from "react-hook-form"; // Библиотека для управления формами
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth); // Проверка, авторизован ли пользователь
  const dispatch = useDispatch(); // Функция для отправки действий в Redux
  
  /**
   * Настройка react-hook-form для управления формой
   * 
   * register - функция для регистрации полей формы
   * handleSubmit - функция-обертка для обработки отправки формы с валидацией
   * setError - функция для установки ошибок валидации вручную
   * errors - объект с ошибками валидации для каждого поля
   * isValid - флаг, указывающий, прошла ли форма валидацию
   */
  const { 
    register, 
    handleSubmit, 
    setError, 
    formState: { errors, isValid } 
  } = useForm({
    defaultValues: {
      email: 'test@example.com', // Значения по умолчанию для тестирования
      password: '123'
    },
    mode: 'onChange' // Валидация происходит при каждом изменении поля
  });

  /**
   * Обработчик отправки формы
   * 
   * Выполняется только если все поля прошли валидацию.
   * Отправляет данные на сервер через Redux action fetchAuth.
   * 
   * @param {Object} values - Объект с данными формы (email, password)
   */
  const onSubmit = async (values) => {
    // Отправляем данные на сервер через Redux action
    const data = await dispatch(fetchAuth(values));

    // Проверяем, успешно ли прошла авторизация
    if (!data.payload) {
      return alert('Не удалось авторизоваться');
    }
    
    // Если сервер вернул токен, сохраняем его в localStorage
    // Токен будет автоматически добавляться в заголовки запросов через axios interceptor
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  /**
   * Если пользователь уже авторизован, перенаправляем на главную страницу
   * Это предотвращает повторный вход уже авторизованного пользователя
   */
  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      {/* Заголовок страницы */}
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      
      {/* Форма авторизации */}
      {/* handleSubmit оборачивает onSubmit и выполняет валидацию перед вызовом */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Поле ввода email */}
        <TextField
          className={styles.field}
          label="E-Mail"
          type="email"
          // Показываем ошибку валидации, если она есть
          error={Boolean(errors.email?.message)}
          // Отображаем текст ошибки под полем
          helperText={errors.email?.message}
          // Регистрируем поле в react-hook-form с правилом валидации
          // required: 'Укажите почту' - сообщение об ошибке, если поле пустое
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />
        
        {/* Поле ввода пароля */}
        <TextField 
          className={styles.field} 
          label="Пароль"
          type="password" // Скрывает вводимый текст
          // Показываем ошибку валидации, если она есть
          error={Boolean(errors.password?.message)}
          // Отображаем текст ошибки под полем
          helperText={errors.password?.message}
          // Регистрируем поле в react-hook-form с правилом валидации
          {...register('password', { required: 'Укажите пароль' })}
          fullWidth 
        />
        
        {/* Кнопка отправки формы */}
        {/* disabled={!isValid} - кнопка активна только если все поля прошли валидацию */}
        <Button 
          disabled={!isValid} 
          type="submit" 
          size="large" 
          variant="contained" 
          fullWidth
        >
          Войти
        </Button>
      </form>
    </Paper>
  );
};
