import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCommentDTO } from 'src/interfaces/CreateCommentDTO';
import { CommentService } from 'src/services/comment/comment.service';

@Controller('/comment')
export class CommentController {
  constructor(private readonly commentservice: CommentService) {}

  @Post()
  createComment(@Body() body: CreateCommentDTO) {
    const { postId, text, userId } = body;

    try {
      const comment = this.commentservice.createComment({
        postId,
        text,
        userId,
      });

      return comment;
    } catch (error) {
      return error.message;
    }
  }

  @Post('/like')
  handleLikeComment(@Body() body: { commentId: number; userId: number }) {
    const { commentId, userId } = body;

    try {
      const like = this.commentservice.handleLikeComment({ commentId, userId });

      return like;
    } catch (error) {
      return error.message;
    }
  }

  @Get()
  getComments() {
    const comments = this.commentservice.getComments();

    return comments;
  }
}
