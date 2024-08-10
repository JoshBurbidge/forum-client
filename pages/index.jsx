import {  Box, Button, Container, Stack } from '@mui/material';
import PostCard from '../components/PostCard';
import ArrowButton from '../components/ArrowButton';
import { useCallback, useEffect, useRef, useState } from 'react';
import NextLink from "next/link";
import { getServerDomainForBrowser } from '../utils/request-util';

export async function getServerSideProps() {
  const url = process.env.NEXT_PUBLIC_serverDomain + "/posts";
  const postsRes = await fetch(url);
  const allPosts = await postsRes.json();

  return {
    props: {
      posts: allPosts,
    }
  };
}

export default function Home(props) {
  const [currentPosts, setCurrentPosts] = useState(props.posts);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log(entry);
        setIsIntersecting(entry.isIntersecting);
      },
      {}
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);


  const postsList = currentPosts.map(post => {
    return <PostCard post={post} key={post.id} />;
  });

  async function getNextPage() {
    const res = await fetch(getServerDomainForBrowser() + '/posts?offset=' + postsList.length);
    const newPosts = await res.json();
    setCurrentPosts(c => c.concat(newPosts));
  }

  const cachedGetNexPage = useCallback(getNextPage, [postsList.length]);

  useEffect(() => {
    if (isIntersecting) {
      cachedGetNexPage();
    }
  }, [isIntersecting]);

  return (
    <>
      <Container >
        <NextLink href={'/posts/new'}>
          <Button variant='contained' sx={{ mt: 3 }}>New Post</Button>
        </NextLink>

        <Stack paddingY={3} spacing={3}>
          {postsList}
          <ArrowButton/>
          <Box
            visibility={'hidden'}
            height={0}
            ref={ref}
          >
            {'bottom detector'}
          </Box>
        </Stack>
      </Container>
    </>
  );
}
