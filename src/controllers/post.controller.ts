import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CreatePostDTO } from 'src/interfaces/CreatePostDTO';
import { PostService } from 'src/services/post/post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() body: CreatePostDTO) {
    const { text, title, userId } = body;

    try {
      const post = this.postService.createPost({ text, title, userId });

      return post;
    } catch (error) {
      return error.message;
    }
  }

  @Post('/like')
  likePost(@Body() body: { postId: number; userId: number }) {
    const { postId, userId } = body;

    try {
      const like = this.postService.handleLikePost({ postId, userId });

      return like;
    } catch (error) {
      return error.message;
    }
  }

  @Get()
  getPosts() {
    const posts = this.postService.getPosts();

    return posts;
  }

  @Delete()
  deletePost(@Body() body: { postId: number }) {
    const { postId } = body;

    try {
      const post = this.postService.deletePost(postId);

      return post;
    } catch (error) {
      return error.message;
    }
  }
}
