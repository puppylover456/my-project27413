/**
 * Компонент Skeleton (скелетон) для поста
 * 
 * Показывается во время загрузки данных поста.
 * Отображает анимированные заглушки, имитирующие структуру поста.
 * Это улучшает UX, так как пользователь видит, что контент загружается.
 */
import React from "react";
import Stack from "@mui/material/Stack"; // Компонент для вертикального расположения элементов
import Skeleton from "@mui/material/Skeleton"; // Компонент анимированной заглушки

import styles from "./Post.module.scss";

export const PostSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <Stack spacing={1}>
        {/* Skeleton для изображения поста */}
        <Skeleton variant="rectangular" width="100%" height={300} />
        
        <div className={styles.skeletonContent}>
          {/* Skeleton для информации о пользователе (аватар + имя) */}
          <div className={styles.skeletonUser}>
            {/* Круглый skeleton для аватара */}
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              style={{ marginRight: 10 }}
            />
            <div className={styles.skeletonUserDetails}>
              {/* Skeleton для имени пользователя */}
              <Skeleton variant="text" width={60} height={20} />
              {/* Skeleton для даты */}
              <Skeleton variant="text" width={100} height={15} />
            </div>
          </div>
          
          {/* Skeleton для основного контента */}
          <div className={styles.skeletonInfo}>
            {/* Skeleton для заголовка поста */}
            <Skeleton variant="text" width="80%" height={45} />
            {/* Skeleton для тегов */}
            <div className={styles.skeletonTags}>
              <Skeleton variant="text" width={40} height={30} />
              <Skeleton variant="text" width={40} height={30} />
              <Skeleton variant="text" width={40} height={30} />
            </div>
          </div>
        </div>
      </Stack>
    </div>
  );
};
