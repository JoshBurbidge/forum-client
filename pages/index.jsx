import { Box, Button, Container, Stack } from '@mui/material'
import PostCard from '../components/PostCard';
import axios from 'axios'
import { getUserIdCookie } from '../util/cookie';
import ArrowButton from '../components/ArrowButton';
import { useState, useContext } from 'react';
import { UserContext } from '../components/UserContext';
import NextLink from "next/link"


export async function getServerSideProps(ctx) {
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
  //console.log(props);
  const [currentPosts, setCurrentPosts] = useState(props.posts);

  const postsList = currentPosts.map(post => {
    return <PostCard post={post} key={post.id} />
  });

  async function getNextPage() {
    const res = await fetch(process.env.NEXT_PUBLIC_serverDomain + '/posts?offset=' + postsList.length);
    const newPosts = await res.json();
    return newPosts;
  }

  //console.log(useContext(UserContext))
  // const { loggedIn } = useContext(UserContext).user;

  return (
    <>
      <Container >
        {/* {loggedIn && */}
        <NextLink href={'/posts/new'}>
          <Button variant='contained' sx={{ mt: 3 }}>New Post</Button>
        </NextLink>
        {/* } */}

        <Stack paddingY={3} spacing={3}>
          {postsList}
          <ArrowButton onClick={async () => {
            const newposts = await getNextPage();
            setCurrentPosts(currentPosts.concat(newposts));
          }} />
        </Stack>
      </Container>
    </>
  )
}
