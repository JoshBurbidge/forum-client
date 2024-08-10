import { Box } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Test() {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entry) => { // fires when something enters, calls with one element at a time
        console.log(entry);
        setIsIntersecting(entry[0].isIntersecting); // intersecting with the devices viewport
      },
      {
        rootMargin: '-200px'
        // null root means watch for intersections with the viewport
        // otherwise provide which element you're intersecting with
      }
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);


  return (
    <Box width={'100%'}>
      <Box height={'100vh'}>This is the Header</Box>
      <Box className={'main'} ref={ref} display={'flex'} height={'100px'} bgcolor={'lightgray'} width={'100%'}>
        <Box className="child-one" flex={1}>Child One</Box>
        <Box className="child-two" flex={1} bgcolor={'gray'} sx={{transform: isIntersecting ? 'translateX(0)' : 'translateX(150%)' }}>Child Two</Box>
      </Box>
      <Box height={'100vh'}>This is the Footer</Box>
    </Box>
  );
}

// detect viewport intersection with bottom element
// on intersection, fetch more
// if fetch is empty, stop fetching
// maybe: check intersectionRect y/top value to determine if it's intersecting at the bottom or top
