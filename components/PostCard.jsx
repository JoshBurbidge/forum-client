import { Typography, Card } from "@mui/material";
import NextLink from "next/link";
import { useEffect, useRef, useState } from 'react';

export default function Post(props) {
  const [hover, setHover] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const ref = useRef(null);

  const toggleHover = function () {
    setHover(!hover);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '-50px'
      }
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <NextLink href={"/posts/" + props.post.id} passHref>
      <Card onMouseEnter={() => toggleHover()} onMouseLeave={() => toggleHover()}
        ref={ref}
        sx={{
          border: 1,
          borderColor: hover ? 'black' : 'transparent',
          transition: 'all ease-in 0.3s;',
          opacity: isIntersecting ? 1 : 0
        }}
      >
        <Typography pl={1} variant="subtitle2">
          {`posted by ${props.post.username}`}
        </Typography>

        <Typography p={2} variant='h6'>
          {props.post.title}
        </Typography>
      </Card>
    </NextLink >

  );
}
