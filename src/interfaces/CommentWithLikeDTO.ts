export interface CommentWithLikeDTO {
  id: number;
  text: string;
  postId: number;
  userId: number;
  commentLikes: number;
}
