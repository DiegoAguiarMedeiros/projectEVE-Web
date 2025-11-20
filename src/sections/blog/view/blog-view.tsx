import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";

import { _posts } from "src/_mock";
import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";

import { PostItem } from "src/sections/blog/post-item";
import { PostSort } from "src/sections/blog/post-sort";
import { PostSearch } from "src/sections/blog/post-search";

// ----------------------------------------------------------------------

export function BlogView() {
  const [sortBy, setSortBy] = useState("latest");

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Blog
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New post
        </Button>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <PostSearch posts={_posts} />
        <PostSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: "latest", label: "Latest" },
            { value: "popular", label: "Popular" },
            { value: "oldest", label: "Oldest" },
          ]}
        />
      </Box>

      <Grid2 container spacing={3}>
        {_posts.map((post, index) => {
          const latestPostLarge = index === 0;
          const latestPost = index === 1 || index === 2;

          return (
            <Grid2
              key={post.id}
              sx={{
                gridColumn: {
                  xs: "span 12", // Sempre ocupa 12 colunas para xs
                  sm: latestPostLarge ? "span 12" : "span 6", // Condicional para sm
                  md: latestPostLarge ? "span 6" : "span 3", // Condicional para md
                },
              }}
            >
              <PostItem post={post} latestPost={latestPost} latestPostLarge={latestPostLarge} />
            </Grid2>
          );
        })}
      </Grid2>

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: "auto" }} />
    </DashboardContent>
  );
}
