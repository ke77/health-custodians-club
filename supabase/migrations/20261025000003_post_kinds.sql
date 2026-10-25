-- two more kinds of post for the blog: news and article
alter type public.post_kind add value if not exists 'news';
alter type public.post_kind add value if not exists 'article';
