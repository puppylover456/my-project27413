import React from "react";
import {BrowserRouter} from 'react-router-dom' // Для маршрутизации (роутинга) в приложении
import {Provider} from 'react-redux' // Провайдер для доступа к Redux store во всем приложении
import ReactDOM from "react-dom/client"; // Для рендеринга React приложения

import App from "./App"; // Главный компонент приложения
import CssBaseline from "@mui/material/CssBaseline"; // Сброс стилей браузера для Material-UI

import "./index.scss"; // Глобальные стили приложения
import { ThemeProvider } from "@mui/material"; // Провайдер темы Material-UI
import { theme } from "./theme"; // Кастомная тема приложения
import store from "./redux/store" // Redux store с состоянием приложения

import { useSelector } from 'react-redux';

/**
 * Вспомогательный компонент для отладки состояния авторизации
 * (в данный момент не используется в приложении)
 */
const MyComponent = () => {
  const authData = useSelector((state) => state.auth);

  console.log('Auth state:', authData);
  // здесь вы должны увидеть объект или состояние auth
};

/**
 * Создание корневого элемента React приложения
 * Находим элемент с id="root" в HTML и создаем для него React root
 */
const root = ReactDOM.createRoot(document.getElementById("root"));

/**
 * Рендеринг приложения с необходимыми провайдерами
 * 
 * Порядок провайдеров важен:
 * 1. CssBaseline - сбрасывает стили браузера
 * 2. ThemeProvider - предоставляет тему Material-UI для всех компонентов
 * 3. BrowserRouter - обеспечивает маршрутизацию (роутинг)
 * 4. Provider (Redux) - предоставляет доступ к store для всех компонентов
 * 5. App - главный компонент приложения
 */
root.render(
  <>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </>
);
