import React from "react";
import Typography from "@mui/material/Typography";
import { useDispatch } from 'react-redux' //для переноса данных на бэкенд
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./Login.module.scss";

import { useForm } from "react-hook-form";
import { fetchAuth } from "../../redux/slices/auth";

export const Login = () => {
  const dispatch = useDispatch() //для бэкенда
  const{ register , handleSubmit ,setError,formState: {errors,isValid}} =useForm({ //вытаскиваем функции и все введенные данные регистрируем в useForm
    defaultValues:{
      email: 'test@example.com',
      password: '123'
    },
    mode: 'onChange'
  }); //подключение библиотеки

  const onSubmit = (values) => {  //функция будет выпольняться если валидация прошла успешно
    dispatch(fetchAuth(values)) //ожидает получить обьект с email и паролем,его передаст бэкенд
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography> 
      <form onSubmit={handleSubmit(onSubmit)}> 
      <TextField
        className={styles.field}
        label="E-Mail"
        error ={Boolean(errors.email?.message)} //если информация получена то подсвечивается красным
        helperText= {errors.email?.message} //рендерит информацию об ошибке
        type = "email"
        {... register('email',  { required: 'Укажите почту'})} //Если не указали данные в поле
        fullWidth
      />
      <TextField className={styles.field} 
      label="Пароль"
      error ={Boolean(errors.password?.message)}
      helperText= {errors.password?.message}
      {... register('password',  { required: 'Укажите пароль'})} //Если не указали данные в поле 
      fullWidth />
      <Button type = "submit" size="large" variant="contained" fullWidth>
        Войти
      </Button>
      </form>
    </Paper>
  );
};
