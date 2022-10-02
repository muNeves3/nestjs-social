import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Like, Post, Prisma } from '@prisma/client';
import { CreatePostDTO } from 'src/interfaces/CreatePostDTO';
import { PostWithLikeDTO } from 'src/interfaces/PostWithLikeDTO';
import { client } from 'src/prisma/client';

@Injectable()
export class PostService {
  async createPost({ text, title, userId }: CreatePostDTO): Promise<Post> {
    const post = await client.post.create({
      data: {
        text,
        title,
        userId,
      },
    });

    return post;
  }

  async handleLikePost({
    postId,
    userId,
  }: {
    postId: number;
    userId: number;
  }): Promise<any | Like> {
    let like = await client.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (!like) {
      like = await client.like.create({
        data: {
          postId,
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

  async getPosts(): Promise<PostWithLikeDTO[]> {
    const posts: PostWithLikeDTO[] = await client.$queryRaw(
      Prisma.sql`
      SELECT CAST(count(likes) as int) as "postLikes", post.* FROM post
	    LEFT OUTER JOIN likes on post.id = likes."postId"
      GROUP BY
        post.id,
        post.title,
        post.text,
        post."userId",
        post."publishedAt"
      `,
    );

    return posts;
  }

  async deletePost(id: number): Promise<Post> {
    const post = await client.post.delete({
      where: {
        id,
      },
    });

    if (!post) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This post does not exist',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return post;
  }
}
