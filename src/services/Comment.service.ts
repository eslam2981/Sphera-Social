import axios from "axios";
import type { Comment } from "../types";

const base = import.meta.env.VITE_BASE_URL;

export async function getPostComments(token: string | null, postId: string, limit = 10, page = 1) {
  const { data } = await axios.get(`${base}/posts/${postId}/comments?limit=${limit}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    data: (data.comments || data.data?.comments || data.data || []) as Comment[],
    total: data.meta ? data.meta.pagination.total : 0,
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function createPostComment(token: string | null, postId: string, dataToSend: string | FormData) {
  const payload = typeof dataToSend === "string" ? { content: dataToSend } : dataToSend;
  const { data } = await axios.post(`${base}/posts/${postId}/comments`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    data: (data.comment || data.data?.comment || data.data || data) as Comment,
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function updatePostComment(token: string | null, postId: string, commentId: string, content: string) {
  const { data } = await axios.put(`${base}/posts/${postId}/comments/${commentId}`, { content }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    data: (data.comment || data.data?.comment || data.data || data) as Comment,
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function deletePostComment(token: string | null, postId: string, commentId: string) {
  const { data } = await axios.delete(`${base}/posts/${postId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function likePostComment(token: string | null, postId: string, commentId: string) {
  const { data } = await axios.put(`${base}/posts/${postId}/comments/${commentId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}
