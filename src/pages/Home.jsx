/**
 * Главная страница блога (Home)
 * 
 * Отображает список всех постов, популярные теги и последние комментарии.
 * Использует Redux для управления состоянием постов и тегов.
 * 
 * Особенности:
 * - Загружает посты и теги через Redux actions
 * - Показывает skeleton загрузки во время получения данных
 * - Определяет, может ли пользователь редактировать пост (если он автор)
 * - Отображает вкладки для фильтрации постов (Новые/Популярные)
 */
import React from 'react';
import Tabs from '@mui/material/Tabs'; // Вкладки для фильтрации постов
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid'; // Система сетки для размещения контента
import { useDispatch, useSelector } from 'react-redux'; // Для работы с Redux
import axios from '../axios'; // Импортирован, но не используется (старый код)

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock'; // Блок популярных тегов
import { CommentsBlock } from '../components/CommentsBlock'; // Блок последних комментариев
import { fetchPosts, fetchTags } from '../redux/slices/posts'; // Redux actions для загрузки данных
import { fetchUserData } from '../redux/slices/auth'; // Импортирован, но не используется

export const Home = () => {
  const dispatch = useDispatch(); // Функция для отправки действий в Redux
  
  // Получаем данные из Redux store
  const userData = useSelector(state => state.auth.data); // Информация о текущем пользователе
  const { posts, tags } = useSelector(state => state.posts); // Посты и теги из store

  // Определяем статусы загрузки
  const isPostsLoading = posts.status === 'loading'; // Идет ли загрузка постов
  const isTagsLoading = tags.status === 'loading'; // Идет ли загрузка тегов

  /**
   * Эффект для загрузки данных при монтировании компонента
   * 
   * Загружает список постов и тегов с сервера через Redux actions.
   * Данные сохраняются в Redux store и доступны во всем приложении.
   */
  React.useEffect(() => {
    // Загружаем посты и теги параллельно
    dispatch(fetchPosts()); // Загружает список всех постов
    dispatch(fetchTags()); // Загружает список популярных тегов
  }, []); // Выполняется только при монтировании компонента

  return (
    <>
      {/* Вкладки для фильтрации постов (пока не реализована функциональность) */}
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      
      {/* Сетка для размещения контента */}
      <Grid container spacing={4}>
        {/* Левая колонка - список постов (8 из 12 колонок) */}
        <Grid xs={8} item>
          {/* 
            Условный рендеринг:
            - Если идет загрузка: показываем 5 skeleton постов
            - Если загрузка завершена: показываем реальные посты
          */}
          {(isPostsLoading ? [...Array(5)] : posts?.items).map((obj, index) => (
            isPostsLoading ? (
              // Skeleton загрузки поста
              <Post key={index} isLoading={true} />
            ) : (
              // Реальный пост
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                // Формируем полный URL изображения (если оно есть)
                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3} // TODO: заменить на реальное количество из obj.commentsCount
                tags={obj.tags}
                // Проверяем, является ли текущий пользователь автором поста
                // Если да, то показываем кнопки редактирования и удаления
                isEditable={userData?._id === obj.user._id}
              />
            )
          ))}
        </Grid>
        
        {/* Правая колонка - боковая панель (4 из 12 колонок) */}
        <Grid xs={4} item>
          {/* Блок популярных тегов */}
          <TagsBlock 
            items={tags.items} 
            isLoading={isTagsLoading} 
          />
          
          {/* Блок последних комментариев */}
          {/* TODO: заменить на реальные комментарии из API */}
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: '<333',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};


