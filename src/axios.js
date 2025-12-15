import axios from 'axios';

/**
 * Создание настроенного экземпляра axios для всех HTTP-запросов к бэкенду
 * 
 * baseURL - базовый URL сервера. При использовании этого экземпляра
 * можно указывать только путь (например, '/posts'), а не полный URL
 */
const Instance = axios.create({
    baseURL: 'http://localhost:4444'
})

/**
 * Interceptor для автоматического добавления токена авторизации
 * 
 * Перехватывает каждый запрос перед отправкой и автоматически добавляет
 * токен из localStorage в заголовок Authorization.
 * 
 * Это позволяет не указывать токен вручную в каждом запросе.
 * Сервер проверяет этот токен, чтобы понять, кто делает запрос.
 */
Instance.interceptors.request.use(
  (config) => {
    // Получаем токен из localStorage и добавляем в заголовки запроса
    config.headers.Authorization = window.localStorage.getItem('token');
    return config;
  },
  (error) => {
    // Если произошла ошибка при настройке запроса, передаем её дальше
    return Promise.reject(error);
  }
);

// Экспортируем настроенный экземпляр для использования во всем приложении
export default Instance