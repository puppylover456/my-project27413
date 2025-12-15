/**
 * Компонент для отображения поста (статьи)
 * 
 * Может использоваться в двух режимах:
 * 1. Краткий вид (на главной странице) - показывает превью с ссылкой на полный пост
 * 2. Полный вид (на странице поста) - показывает весь контент статьи
 * 
 * Поддерживает:
 * - Редактирование и удаление (если isEditable = true)
 * - Отображение изображения, тегов, статистики (просмотры, комментарии)
 * - Skeleton загрузку при isLoading = true
 */
import React from 'react';
import {Link } from 'react-router-dom'; // Для навигации между страницами
import clsx from 'clsx'; // Утилита для условного объединения CSS классов
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear'; // Иконка удаления
import EditIcon from '@mui/icons-material/Edit'; // Иконка редактирования
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'; // Иконка просмотров
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'; // Иконка комментариев
import { useDispatch } from 'react-redux';
import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo'; // Компонент информации о пользователе
import { PostSkeleton } from './Skeleton'; // Компонент загрузки (skeleton)
import { fetchRemovePost } from '../../redux/slices/posts'; // Действие для удаления поста

/**
 * @param {string} id - Уникальный идентификатор поста
 * @param {string} title - Заголовок поста
 * @param {string} createdAt - Дата создания поста
 * @param {string} imageUrl - URL изображения поста
 * @param {Object} user - Объект с информацией об авторе поста
 * @param {number} viewsCount - Количество просмотров
 * @param {number} commentsCount - Количество комментариев
 * @param {Array<string>} tags - Массив тегов поста
 * @param {ReactNode} children - Дочерние элементы (обычно текст поста)
 * @param {boolean} isFullPost - Режим полного отображения поста
 * @param {boolean} isLoading - Показывать ли skeleton загрузки
 * @param {boolean} isEditable - Можно ли редактировать/удалять пост
 */
export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch(); // Для отправки действий в Redux

  // Если идет загрузка, показываем skeleton вместо поста
  if (isLoading) {
    return <PostSkeleton />;
  }

  /**
   * Обработчик удаления поста
   * 
   * Показывает подтверждение, затем отправляет действие удаления в Redux
   */
  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      dispatch(fetchRemovePost(id)); // Отправляем действие удаления в Redux
    }
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {/* Кнопки редактирования и удаления (показываются только если isEditable = true) */}
      {isEditable && (
        <div className={styles.editButtons}>
          {/* Ссылка на страницу редактирования поста */}
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          {/* Кнопка удаления поста */}
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      
      {/* Изображение поста (показывается только если imageUrl указан) */}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      
      <div className={styles.wrapper}>
        {/* Компонент с информацией об авторе поста */}
        <UserInfo {...user} additionalText={createdAt} />
        
        <div className={styles.indention}>
          {/* Заголовок поста */}
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {/* В полном режиме - просто текст, в кратком - ссылка на полный пост */}
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          
          {/* Список тегов поста */}
          <ul className={styles.tags}>
            {tags && tags.map((name) => (
              <li key={name}>
                {/* Ссылка на страницу с постами по этому тегу */}
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          
          {/* Содержимое поста (текст статьи) - показывается только в полном режиме */}
          {children && <div className={styles.content}>{children}</div>}
          
          {/* Статистика поста: просмотры и комментарии */}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
