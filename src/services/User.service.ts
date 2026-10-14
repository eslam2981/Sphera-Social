import axios from "axios";
import type { User } from "../types";

const base = import.meta.env.VITE_BASE_URL;

export async function getUserProfile(token: string | null) {
  const { data } = await axios.get(`${base}/users/profile-data`, {
    headers: {
      token: token,
    },
  });

  return {
    data: (data.user || data.data?.user || data.data || data) as User,
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function getUserProfileById(token: string | null, userId: string) {
  const { data } = await axios.get(`${base}/users/${userId}/profile`, {
    headers: {
      token: token,
    },
  });

  return {
    data: (data.user || data.data?.user || data.data || data) as User,
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function uploadProfilePhoto(token: string | null, formData: FormData) {
  const { data } = await axios.put(`${base}/users/profile-picture`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    data: (data.user || data.data?.user || data.data || data) as User,
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function followUser(token: string | null, userId: string) {
  const { data } = await axios.put(`${base}/users/${userId}/follow`, {}, {
    headers: {
      token: token,
    },
  });

  return {
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function unfollowUser(token: string | null, userId: string) {
  const { data } = await axios.put(`${base}/users/${userId}/follow`, {}, {
    headers: {
      token: token,
    },
  });

  return {
    success: data.message === "success" || data.success || true,
    message: data.message,
  };
}

export async function getSuggestedFriends(token: string | null, limit: number = 5) {
  if (!token) return { success: false, data: [] as User[] };

  try {
    const { data } = await axios.get(`${base}/users/suggestions?limit=${limit}`, {
      headers: {
        token: token,
      },
    });

    const users = (data?.data?.suggestions || []) as User[];

    return {
      data: users.slice(0, limit),
      success: data.message === "success" || data.success || true,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [] as User[],
      message: error?.response?.data?.message || "Failed to fetch suggestions",
    };
  }
}
