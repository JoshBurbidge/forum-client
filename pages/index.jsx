import {  Box, Button, Container, Stack } from '@mui/material';
import PostCard from '../components/PostCard';
import ArrowButton from '../components/ArrowButton';
import { useEffect, useRef, useState } from 'react';
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

const getNextPage = async (setCurrentPosts, offset) => {
  const res = await fetch(getServerDomainForBrowser() + '/posts?offset=' + offset);
  const newPosts = await res.json();
  setCurrentPosts(c => c.concat(newPosts));
};

export default function Home(props) {
  const [currentPosts, setCurrentPosts] = useState(props.posts);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [loading, setLoading] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    console.log('useEffect');
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


  useEffect(() => {
    console.log('useEffect', isIntersecting, postsList.length);
    async function fetchPosts() {
      if (!loading) {
        setLoading(true);
        await getNextPage(setCurrentPosts, postsList.length);
        setLoading(false);
      }
    }
    if (isIntersecting && !loading) {
      fetchPosts();
    }
  }, [isIntersecting]);
  // fetches, sets ref back to false, then executes useeffect again
  // before the render has happened, so it's still intersecting
  // So, I don't want it to re-execute after posts length changes, I only want
  // to re-execute on intersection change

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
