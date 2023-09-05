declare interface CommentItem {
  author: string;
  avatar: string;
  content: string;
  datetime: number | string;
  type?: number; // 1- author 2- chatGpt
}
