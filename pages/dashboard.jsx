import {  useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import Post from "../components/PostCard";
import { useAuth0 } from "@auth0/auth0-react";

export async function getServerSideProps() {
  return {
    props: {
      // protected: true
    }
  };
}

export default function Dashboard() {
  const {user, isAuthenticated, isLoading} = useAuth0();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetch() {
      const {data: userPosts} = await axios.get(`${process.env.NEXT_PUBLIC_serverDomain}/users/${user.name}/posts`);
      setPosts(userPosts);
    }
    if (user) {
      fetch();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAuthenticated && (
    <>
      <Typography>Dashboard</Typography>
      <Typography>User: {user.name}</Typography>
      {posts.map(post => (
        <Post post={post} key={post.id}></Post>
      ))}
    </>
  );
}
