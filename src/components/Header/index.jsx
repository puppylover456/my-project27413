/**
 * Компонент шапки (Header) сайта
 * 
 * Отображает навигационную панель с логотипом и кнопками действий.
 * В зависимости от статуса авторизации показывает разные кнопки:
 * - Если авторизован: "Написать статью" и "Выйти"
 * - Если не авторизован: "Войти" и "Создать аккаунт"
 */
import React from 'react';

import { useDispatch } from 'react-redux'; // Для отправки действий в Redux store
import styles from './Header.module.scss';
import Container from '@mui/material/Container'; // Контейнер с ограничением ширины
import { Link } from 'react-router-dom'; // Компонент для навигации между страницами
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux'; // Для получения данных из Redux store
import { logout, selectIsAuth } from '../../redux/slices/auth';





export const Header = () => {
  const dispatch = useDispatch(); // Функция для отправки действий в Redux
  const isAuth = useSelector(selectIsAuth); // Проверка, авторизован ли пользователь

  /**
   * Обработчик выхода из аккаунта
   * 
   * Показывает подтверждение, затем:
   * 1. Отправляет действие logout в Redux (очищает данные пользователя)
   * 2. Удаляет токен из localStorage
   */
  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout()); // Очищает данные пользователя в Redux store
      window.localStorage.removeItem('token'); // Удаляет токен авторизации
    }
  };

  return (
    <div className={styles.root}>
      {/* Container ограничивает максимальную ширину контента */}
      <Container maxWidth="lg">
        <div className={styles.inner}>
          {/* Логотип сайта - ссылка на главную страницу */}
          <Link className={styles.logo} to="/">
            <div>BLOG</div>
          </Link>
          
          {/* Блок с кнопками действий */}
          <div className={styles.buttons}>
            {/* Условный рендеринг: разные кнопки для авторизованных и неавторизованных пользователей */}
            {isAuth ? (
              // Если пользователь авторизован
              <>
                {/* Ссылка на страницу создания новой статьи */}
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                {/* Кнопка выхода из аккаунта */}
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              // Если пользователь НЕ авторизован
              <>
                {/* Ссылка на страницу входа */}
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                {/* Ссылка на страницу регистрации */}
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
