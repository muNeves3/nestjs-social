import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateCommentDTO } from 'src/interfaces/CreateCommentDTO';
import { client } from 'src/prisma/client';
import { Comment, Like, Prisma } from '@prisma/client';
import { CommentWithLikeDTO } from 'src/interfaces/CommentWithLikeDTO';

@Injectable()
export class CommentService {
  constructor(@Inject(CACHE_MANAGER) private cachemanager: Cache) {}

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
    const commentCachekey = `comment`;
    const likeCachekey = `like`;

    let comment = await this.cachemanager.get<Comment[]>(commentCachekey);
    let likes = await this.cachemanager.get<Like[]>(likeCachekey);

    if (!comment) {
      comment = await client.comment.findMany();
      await this.cachemanager.set(commentCachekey, comment, 60 * 60 * 24);
    }
    if (!likes) {
      likes = await client.like.findMany();
      await this.cachemanager.set(likeCachekey, likes, 60 * 60 * 24);
    }

    const commentWithLike = comment.map((comment) => {
      const likesComment = likes.filter(
        (like) => like.commentId === comment.id,
      ).length;

      return {
        ...comment,
        commentLikes: likesComment,
      };
    });

    return commentWithLike;

    // const comments: CommentWithLikeDTO[] = await client.$queryRaw(
    //   Prisma.sql`
    //   SELECT CAST(count(likes) as int) as "commentLikes", "comment".* FROM comment
    //   LEFT OUTER JOIN likes on "comment".id = likes."commentId"
    //   GROUP BY
    //     comment.id,
    //     comment.text,
    //     comment."userId",
    //     comment."postId",
    //     comment."publishedAt"
    //   `,
    // );
    // return comments;
  }

  async getPostComments(postId: number): Promise<CommentWithLikeDTO[]> {
    const commentCachekey = `comment`;
    const likeCachekey = `like`;

    let comment = await this.cachemanager.get<Comment[]>(commentCachekey);
    let likes = await this.cachemanager.get<Like[]>(likeCachekey);

    if (!comment) {
      comment = await client.comment.findMany({
        where: {
          postId,
        },
      });
      await this.cachemanager.set(commentCachekey, comment, 60 * 60 * 24);
    }
    if (!likes) {
      likes = await client.like.findMany();
      await this.cachemanager.set(likeCachekey, likes, 60 * 60 * 24);
    }

    const commentWithLike = comment.map((comment) => {
      const likesComment = likes.filter(
        (like) => like.commentId === comment.id,
      ).length;

      return {
        ...comment,
        commentLikes: likesComment,
      };
    });

    return commentWithLike;
  }

  async deleteComment(id: number): Promise<Comment> {
    const comment = await client.comment.delete({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This post does not exist',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return comment;
  }
}
