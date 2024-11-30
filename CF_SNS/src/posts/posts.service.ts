import {Injectable, NotFoundException} from '@nestjs/common';

export interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts : Post[] = [
  {
    id: 1,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '메이크업을 고치고 있는 민지',
    likeCount: 999,
    commentCount: 90,
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 해린',
    content: '노래 연습하는 해린',
    likeCount: 990,
    commentCount: 111,
  },
  {
    id: 3,
    author: 'blackpink_official',
    title: '로제',
    content: '아파트아파트',
    likeCount: 990,
    commentCount: 111,
  }
]

@Injectable()
export class PostsService {
  getAllPosts() {
    return posts;
  }

  getPostById(id: number) {
    const post = posts.find(post => post.id === id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  createPost(author: string, title: string, content: string) {
    const post: Post = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts = [
      ...posts,
      post,
    ]
    return post;
  }

  updatePost(id: number, author?:string, title?:string, content?:string) {
    const post = posts.find(post => post.id === id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }
    posts = posts.map((prevPost) => prevPost.id === +id ? post : prevPost);
    return post;
  }

  deletePost(id: number) {
    const post = posts.find(post => post.id === id);
    if (!post) {
      throw new NotFoundException(`Delete with id ${id} not found`);
    }

    posts = posts.filter(post => post.id !== +id);
    return id;
  }
}