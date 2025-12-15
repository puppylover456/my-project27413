/**
 * Страница полного отображения поста (статьи)
 * 
 * Отображает полный текст статьи с возможностью просмотра комментариев.
 * Загружает данные поста по ID из URL параметров.
 * 
 * Особенности:
 * - Использует ReactMarkdown для отображения Markdown текста
 * - Показывает skeleton загрузки во время получения данных
 * - Отображает блок комментариев с формой добавления нового комментария
 * 
 * Проблема: использует обычный axios вместо настроенного экземпляра из axios.js
 */
import React from "react";
import { useParams } from "react-router-dom"; // Для получения параметров из URL
import axios from 'axios'; // TODO: заменить на настроенный экземпляр из '../axios'

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from 'react-markdown'; // Библиотека для рендеринга Markdown

export const FullPost = () => {
  // Состояние для хранения данных поста
  const [data, setData] = React.useState();
  // Состояние загрузки данных
  const [isLoading, setLoading] = React.useState(true);

  // Получаем ID поста из URL параметров (например, /posts/123 -> id = "123")
  const { id } = useParams();

  /**
   * Эффект для загрузки данных поста при монтировании компонента
   * 
   * Загружает полную информацию о посте с сервера по его ID.
   * После успешной загрузки обновляет состояние и скрывает индикатор загрузки.
   */
  React.useEffect(() => {
    // TODO: заменить на axios из '../axios' для использования базового URL и авторизации
    axios.get(`http://localhost:4444/posts/${id}`)
      .then(res => {
        setData(res.data); // Сохраняем данные поста
        setLoading(false); // Скрываем индикатор загрузки
      })
      .catch(err => {
        console.warn(err);
        alert("Ошибка при получении статьи");
        setLoading(false); // Скрываем индикатор загрузки даже при ошибке
      });
  }, [id]); // Зависимость от id - эффект выполнится при изменении ID

  // Если идет загрузка, показываем skeleton вместо поста
  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      {/* Компонент поста в полном режиме отображения */}
      <Post
        id={data._id}
        title={data.title}
        imageUrl={`http://localhost:4444${data.imageUrl}`}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3} // TODO: заменить на реальное количество комментариев из data
        tags={data.tags}
        isFullPost // Флаг полного режима отображения
      >
        {/* Содержимое поста - текст статьи в формате Markdown */}
        <p>
          {/* ReactMarkdown преобразует Markdown текст в HTML */}
          <ReactMarkdown children={data.text} />
        </p>
      </Post>
      
      {/* Блок комментариев */}
      <CommentsBlock
        // TODO: заменить на реальные комментарии из data.comments
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        {/* Форма для добавления нового комментария */}
        <Index />
      </CommentsBlock>
    </>
  );
};
