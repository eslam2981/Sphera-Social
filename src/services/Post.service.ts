import axios from "axios";
import type { Post } from "../types";

const base = import.meta.env.VITE_BASE_URL;

export async function getPosts(token: string | null, limit = 40, page = 1) {
  const { data } = await axios.get(`${base}/posts?limit=${limit}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    data: data.data ? (data.data.posts as Post[]) : [],
    total: data.meta ? data.meta.pagination.total : 6978,
    success: data.success,
    message: data.message,
  };
}

export async function getUserPosts(token: string | null, userId: string, limit = 40, page = 1) {
  const { data } = await axios.get(`${base}/users/${userId}/posts?limit=${limit}&page=${page}`, {
    headers: {
      token: token,
    },
  });

  return {
    data: (data.posts || data.data?.posts || data.data || []) as Post[],
    total: data.meta ? data.meta.pagination.total : 0,
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function getSinglePost(token: string | null, postId: string) {
  const { data } = await axios.get(`${base}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export async function createPost(token: string | null, formData: FormData) {
  const { data } = await axios.post(`${base}/posts`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    data: data.post || data.data?.post || data.data || data,
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function updatePost(token: string | null, postId: string, formData: FormData) {
  const { data } = await axios.put(`${base}/posts/${postId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    data: data.post || data.data?.post || data.data || data,
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function deletePost(token: string | null, postId: string) {
  const { data } = await axios.delete(`${base}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function likePost(token: string | null, postId: string) {
  const { data } = await axios.put(`${base}/posts/${postId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function sharePost(token: string | null, postId: string, body: string = "") {
  const { data } = await axios.post(`${base}/posts/${postId}/share`, { body }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    data: data.post || data.data?.post || data.data || data,
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}
