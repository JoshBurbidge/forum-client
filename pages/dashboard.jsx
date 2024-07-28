import {  useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import Post from "../components/PostCard";
import { useAuth0 } from "@auth0/auth0-react";
import { getServerDomainForBrowser } from "../utils/request-util";

export async function getServerSideProps() {
  return {
    props: {
      protected: true
    }
  };
}

export default function Dashboard() {
  const {user} = useAuth0();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetch() {
      // TODO: refactor to use ServerSideProps
      const {data: userPosts} = await axios.get(`${getServerDomainForBrowser()}/users/${user.name}/posts`);
      setPosts(userPosts);
    }
    if (user) {
      fetch();
    }
  }, [user]);

  return (
    <>
      <Typography>Dashboard</Typography>
      <Typography>User: {user.name}</Typography>
      {posts.map(post => (
        <Post post={post} key={post.id}></Post>
      ))}
    </>
  );
}
