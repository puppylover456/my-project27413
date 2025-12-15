/**
 * Страница регистрации нового пользователя
 * 
 * Использует react-hook-form для управления формой и валидации.
 * После успешной регистрации:
 * - Сохраняет токен в localStorage
 * - Автоматически авторизует пользователя
 * - Перенаправляет на главную страницу
 * 
 * Если пользователь уже авторизован, автоматически перенаправляет на главную.
 */
import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Navigate } from "react-router-dom"; // Для программного перенаправления
import { useDispatch, useSelector } from 'react-redux'; // Для работы с Redux
import Avatar from '@mui/material/Avatar'; // Компонент для отображения аватара
import { useForm } from "react-hook-form"; // Библиотека для управления формами
import styles from './Login.module.scss';
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";

export const Registration = () => {
    const isAuth = useSelector(selectIsAuth); // Проверка, авторизован ли пользователь
    const dispatch = useDispatch(); // Функция для отправки действий в Redux
    
    /**
     * Настройка react-hook-form для управления формой
     * 
     * register - функция для регистрации полей формы
     * handleSubmit - функция-обертка для обработки отправки формы с валидацией
     * errors - объект с ошибками валидации для каждого поля
     * isValid - флаг, указывающий, прошла ли форма валидацию
     */
    const { 
      register, 
      handleSubmit, 
      formState: { errors, isValid } 
    } = useForm({
      defaultValues: {
        fullName: 'Саша Алексеев', // Значения по умолчанию для тестирования
        email: 'sasha@example.com',
        password: '123'
      },
      mode: 'onChange' // Валидация происходит при каждом изменении поля
    });

    /**
     * Обработчик отправки формы регистрации
     * 
     * Выполняется только если все поля прошли валидацию.
     * Отправляет данные на сервер через Redux action fetchRegister.
     * После успешной регистрации пользователь автоматически авторизуется.
     * 
     * @param {Object} values - Объект с данными формы (fullName, email, password)
     */
    const onSubmit = async (values) => {
      // Отправляем данные на сервер через Redux action для регистрации
      const data = await dispatch(fetchRegister(values));
    
      // Проверяем, успешно ли прошла регистрация
      if (!data.payload) {
        return alert('Не удалось зарегистрироваться');
      }
      
      // Если сервер вернул токен, сохраняем его в localStorage
      // Токен будет автоматически добавляться в заголовки запросов через axios interceptor
      // После регистрации пользователь автоматически авторизуется
      if ('token' in data.payload) {
        window.localStorage.setItem('token', data.payload.token);
      }
    };

    /**
     * Если пользователь уже авторизован, перенаправляем на главную страницу
     * Это предотвращает повторную регистрацию уже авторизованного пользователя
     */
    if (isAuth) {
      return <Navigate to="/" />;
    }

  return (
    <Paper classes={{ root: styles.root }}>
      {/* Заголовок страницы */}
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      
      {/* Аватар пользователя (пока без загрузки изображения) */}
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      
      {/* Форма регистрации */}
      {/* handleSubmit оборачивает onSubmit и выполняет валидацию перед вызовом */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Поле ввода email */}
        <TextField 
          className={styles.field}
          label="Электронная почта"
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
        
        {/* Поле ввода полного имени */}
        <TextField 
          className={styles.field}
          label="Полное имя"
          // Показываем ошибку валидации, если она есть
          error={Boolean(errors.fullName?.message)}
          // Отображаем текст ошибки под полем
          helperText={errors.fullName?.message}
          // Регистрируем поле в react-hook-form с правилом валидации
          {...register('fullName', { required: 'Укажите полное имя' })}
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
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
