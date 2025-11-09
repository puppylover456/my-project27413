import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch , useSelector } from 'react-redux'
import axios from '../axios';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { fetchUserData } from '../redux/slices/auth';

export const Home = () => {
  const dispatch = useDispatch()
  
  
  const {posts ,tags } = useSelector(state => state.posts)
  const isPostsLoading = posts.status === 'loading'; //загрузка постов
  const isTagsLoading = tags.status === 'loading'; //загрузка тэгов


  React.useEffect (() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
    
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
          {(isPostsLoading ? [ ...Array(5)] : posts?.items).map((obj,index) => (
            isPostsLoading ? (
            
            <Post key = {index} isLoading={true} />
            ) : (
            <Post
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              
              isEditable
            />
    
      )

          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
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


