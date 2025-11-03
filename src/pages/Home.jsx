import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch , useSelector } from 'react-redux'
import axios from '../axios';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts } from '../redux/slices/posts';

export const Home = () => {
  const dispatch = useDispatch()
  
  
  const {posts ,tags } = useSelector(state => state.posts)
  const isPostsLoading = posts.status === 'loading';

  React.useEffect (() => {
    dispatch(fetchPosts())
    /* Загружаем данные с API 
    axios.get('/posts' ,{ headers: { 'Cache-Control': 'no-cache' } })
      .then((response) => {
        console.log('API response data:', response.data);
        setPosts(response.data); // предполагается, что API возвращает массив постов
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки постов', err);
        setLoading(false);
      });
  }, []);

  // Проверка: если идет загрузка
  if (loading) {
    return <div>Загрузка...</div>;
  } */

}, [])


console.log(posts)

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [ ...Array(5)] : posts.items).map((obj,index) => (
            <Post
              
              id={1}
              title="Название статьи"
              imageUrl="https://ru.pinterest.com/pin/1015350678515140949/"
              user={{
                avatarUrl:
                 'https://ru.pinterest.com/pin/1070097561489803246/',
                fullName: "Я",
              }}
              createdAt={"12 июня 2022"}
              viewsCount={150}
              commentsCount={3}
              tags={['ract','gggg','ggggg']}
              isLoading={true}
              isEditable
            />
          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={['react', 'typescript', 'заметки']} isLoading={false} />
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
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};


