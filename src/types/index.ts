export interface User {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
  email?: string;
  cover?: string;
  createdAt?: string;
  gender?: string;
  dateOfBirth?: string;
  followersCount?: number;
  followingCount?: number;
}

export interface Post {
  _id: string;
  body?: string;
  image?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  topComment?: Comment | null;
  sharesCount: number;
  user: User;
  likes?: string[];
  isShare?: boolean;
  sharedPost?: Post | null;
}

export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  commentCreator?: User;
  user?: User;
  post: string;
  likesCount?: number;
  isLiked?: boolean;
  image?: string;
}

export interface UserContextType {
  Data: User | null;
  saveUserData: (data: User | null) => void;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  dateOfBirth: string;
  gender: string;
  username?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  password: string;
  newPassword: string;
}

export interface PostCardStatsProps {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

export interface PostCardHeaderProps {
  postId?: string;
  authorId: string;
  hideOptions?: boolean;
  isRepostHeader?: boolean;
  authorName: string;
  authorPhoto?: string;
  timeAgo: string;
  content: string;
  currentUserId: string;
  onDeleteClick: () => void;
  onEditClick?: () => void;
}

export interface PostCardContentProps {
  content: string;
  imageUrl?: string;
}

export interface PostCardActionsProps {
  liked: boolean;
  onLike: () => void;
  onCommentToggle: () => void;
  onShare: () => void;
}

export interface PostCardProps {
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  likes: number;
  likesArray?: string[];
  comments: number;
  topComment?: Comment | null;
  shares: number;
  onPostDeleted?: () => void;
  onPostShared?: (post: Post) => void;
  isShare?: boolean;
  reposterId?: string;
  reposterName?: string;
  reposterPhoto?: string;
  reposterTimeAgo?: string;
  reposterContent?: string;
  priority?: boolean;
}

export interface CreatePostProps {
  onPostCreated?: (post: Post) => void;
}

export interface CommentsSectionProps {
  isCommentsOpen: boolean;
  isLoadingComments: boolean;
  commentsList: Comment[];
  topComment?: Comment | null;
  currentUserId: string;
  newCommentText: string;
  setNewCommentText: (text: string) => void;
  commentImage?: File | null;
  setCommentImage?: (file: File | null) => void;
  handleAddComment: () => void;
  isSubmittingComment: boolean;
  onCommentToggle?: () => void;
  commentsCount?: number;
  handleDeleteComment: (id: string) => Promise<void> | void;
  handleEditComment: (id: string, newContent: string) => Promise<void> | void;
  handleLikeComment: (id: string) => void;
}

export interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
  onDelete: () => Promise<void> | void;
  onEdit: (newContent: string) => Promise<void> | void;
  onLike: () => Promise<void> | void;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface SuccessMessageProps {
  message: string | null;
}

export interface ErrorMessageProps {
  message: string | null;
}
