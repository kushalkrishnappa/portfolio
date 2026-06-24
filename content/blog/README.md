# Blog posts

Add a post by creating an `.mdx` file in this directory. The filename becomes the
URL slug (`my-first-post.mdx` -> `/blog/my-first-post`).

Each post needs frontmatter at the top:

```
---
title: "My first post"
date: "2026-07-01"        # ISO date — used for sorting and display
summary: "One-line teaser shown on the /blog listing."
tags: ["distributed-systems", "temporal"]
published: true            # set false (or omit) to keep it hidden
---

Write your post body here in Markdown/MDX. Headings, lists, links, and
`code` / fenced code blocks are all styled automatically.
```

Posts with `published: false` (or no `published` field) are hidden from the
listing and return 404 at their URL. When there are zero published posts, the
`/blog` page shows the "Working on it" placeholder.
