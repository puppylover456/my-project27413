/**
 * Страница создания/редактирования поста
 * 
 * Поддерживает два режима работы:
 * 1. Создание нового поста (когда id отсутствует в URL)
 * 2. Редактирование существующего поста (когда id присутствует в URL)
 * 
 * Функционал:
 * - Загрузка изображения для превью
 * - Редактор Markdown для текста статьи (SimpleMDE)
 * - Ввод заголовка и тегов
 * - Автосохранение черновика
 */
import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor'; // Markdown редактор
import { useNavigate, useParams } from "react-router-dom";

import 'easymde/dist/easymde.min.css'; // Стили для Markdown редактора
import styles from './AddPost.module.scss';
import axios from '../../axios';

export const AddPost = () => {
  const navigate = useNavigate(); // Хук для программной навигации
  const { id } = useParams(); // Получаем ID поста из URL (если редактируем)
  
  // Состояния для полей формы
  const [text, setText] = React.useState(''); // Текст статьи (Markdown)
  const [title, setTitle] = React.useState(''); // Заголовок статьи
  const [isLoading, setLoading] = React.useState(false); // Статус загрузки
  const [imageUrl, setImageUrl] = React.useState(''); // URL загруженного изображения
  const [tags, setTags] = React.useState(''); // Теги (строка, разделенная запятыми)

  // Определяем, редактируем ли мы существующий пост
  const isEditing = Boolean(id);
  
  // Ссылка на скрытый input для загрузки файла
  const inputFileRef = React.useRef(null);

  /**
   * Обработчик загрузки изображения
   * 
   * Создает FormData, отправляет файл на сервер,
   * получает URL загруженного изображения и сохраняет его в состояние
   */
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData(); // Создаем объект для отправки файла
      const file = event.target.files[0]; // Получаем выбранный файл
      formData.append('image', file); // Добавляем файл в FormData
      
      // Отправляем файл на сервер для загрузки
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url); // Сохраняем URL загруженного изображения
      console.log(data);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла');
    }
  };

  /**
   * Обработчик удаления изображения
   * 
   * Очищает URL изображения из состояния
   */
  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  /**
   * Обработчик изменения текста в Markdown редакторе
   * 
   * Использует useCallback для оптимизации производительности
   */
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  /**
   * Обработчик отправки формы (создание/обновление поста)
   * 
   * В зависимости от режима (создание/редактирование):
   * - Создает новый пост (POST /posts)
   * - Обновляет существующий пост (PATCH /posts/:id)
   * 
   * После успешной отправки перенаправляет на страницу созданного/отредактированного поста
   */
  const omSubmit = async () => {
    try {
      setLoading(true);

      // Подготавливаем данные для отправки
      const fields = {
        text,
        title, 
        imageUrl,
        tags, // Теги отправляются как строка
      };

      // Отправляем данные на сервер
      const { data } = isEditing 
        ? await axios.patch(`/posts/${id}`, fields) // Обновление существующего поста
        : await axios.post('/posts', fields); // Создание нового поста

      // Определяем ID поста (при редактировании используем существующий, при создании - новый)
      const _id = isEditing ? id : data._id;

      // Перенаправляем на страницу созданного/отредактированного поста
      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Эффект для загрузки данных поста при редактировании
   * 
   * Если в URL есть id, загружаем данные поста с сервера
   * и заполняем форму этими данными
   */
  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        // Преобразуем массив тегов в строку (если теги приходят как массив)
        setTags(Array.isArray(data.tags) ? data.tags.join(',') : '');
      });
    }
  }, [id]);

  /**
   * Настройки для Markdown редактора (SimpleMDE)
   * 
   * useMemo используется для оптимизации - настройки создаются только один раз
   */
  const options = React.useMemo(
    () => ({
      spellChecker: false,      // Отключаем проверку орфографии
      maxHeight: '400px',        // Максимальная высота редактора
      autofocus: true,           // Автоматический фокус при загрузке
      placeholder: 'Введите текст...',
      status: false,             // Скрываем статус-бар редактора
      autosave: {
        enabled: true,           // Включаем автосохранение
        delay: 1000,             // Автосохранение каждую секунду
      },
    }),
    [],
  );


  

  return (
    <Paper style={{ padding: 30 }}>
      {/* Кнопка для открытия диалога выбора файла */}
      <Button 
        onClick={() => inputFileRef.current.click()} 
        variant="outlined" 
        size="large"
      > 
        Загрузить превью
      </Button>
      
      {/* Скрытый input для загрузки файла */}
      <input 
        ref={inputFileRef} 
        type="file" 
        onChange={handleChangeFile} 
        hidden 
        accept="image/*" // Принимаем только изображения
      />
      
      {/* Кнопка удаления изображения (показывается только если изображение загружено) */}
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )}
      
      {/* Превью загруженного изображения */}
      {imageUrl && (
        <img 
          className={styles.image} 
          src={`http://localhost:4444${imageUrl}`} 
          alt="Uploaded" 
        />
      )}
      
      <br />
      <br />
      
      {/* Поле ввода заголовка статьи */}
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      
      {/* Поле ввода тегов (через запятую) */}
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        classes={{ root: styles.tags }} 
        variant="standard" 
        placeholder="Тэги" 
        fullWidth 
      />
      
      {/* Markdown редактор для текста статьи */}
      <SimpleMDE 
        className={styles.editor} 
        value={text} 
        onChange={onChange} 
        options={options} 
      />
      
      {/* Кнопки действий */}
      <div className={styles.buttons}>
        {/* Кнопка сохранения/публикации */}
        <Button 
          onClick={omSubmit} 
          size="large" 
          variant="contained"
          disabled={isLoading} // Блокируем кнопку во время загрузки
        >
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        
        {/* Кнопка отмены (возврат на главную) */}
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
