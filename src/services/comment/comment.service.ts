import { Injectable } from '@nestjs/common';
import { CreateCommentDTO } from 'src/interfaces/CreateCommentDTO';
import { client } from 'src/prisma/client';
import { Comment, Like, Prisma } from '@prisma/client';
import { CommentWithLikeDTO } from 'src/interfaces/CommentWithLikeDTO';

@Injectable()
export class CommentService {
  async createComment({
    postId,
    text,
    userId,
  }: CreateCommentDTO): Promise<Comment> {
    const comment = await client.comment.create({
      data: {
        postId,
        text,
        userId,
      },
    });

    return comment;
  }

  async handleLikeComment({
    commentId,
    userId,
  }: {
    commentId: number;
    userId: number;
  }): Promise<any | Like> {
    let like = await client.like.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (!like) {
      like = await client.like.create({
        data: {
          commentId,
          userId,
        },
      });
      return like;
    }

    like = await client.like.delete({
      where: {
        id: like.id,
      },
    });
  }

  async getComments(): Promise<CommentWithLikeDTO[]> {
    const comments: CommentWithLikeDTO[] = await client.$queryRaw(
      Prisma.sql`
      SELECT CAST(count(likes) as int) as "commentLikes", "comment".* FROM comment
	    LEFT OUTER JOIN likes on "comment".id = likes."commentId"
      GROUP BY
        comment.id,
        comment.text,
        comment."userId",
        comment."postId",
        comment."publishedAt"
      `,
    );

    return comments;
  }
}
