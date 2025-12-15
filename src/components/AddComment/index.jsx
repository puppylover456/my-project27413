/**
 * Компонент для добавления комментария к посту
 * 
 * Отображает форму с полем для ввода комментария и кнопкой отправки.
 * Показывает аватар пользователя рядом с полем ввода.
 */
import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = () => {
  return (
    <>
      <div className={styles.root}>
        {/* Аватар текущего пользователя, который будет оставлять комментарий */}
        <Avatar
          classes={{ root: styles.avatar }}
          src="https://mui.com/static/images/avatar/5.jpg"
        />
        <div className={styles.form}>
          {/* Многострочное текстовое поле для ввода комментария */}
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}      // Максимальное количество видимых строк
            multiline         // Разрешает многострочный ввод
            fullWidth         // Занимает всю доступную ширину
          />
          {/* Кнопка для отправки комментария на сервер */}
          <Button variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
