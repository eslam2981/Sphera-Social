import axios from "axios";

const base = import.meta.env.VITE_BASE_URL;

export async function getNotifications(
  token: string | null,
  unread: boolean = false,
  page: number = 1,
  limit: number = 10
) {
  const { data } = await axios.get(
    `${base}/notifications?unread=${unread}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    success: data.message === "success" || data.success || true,
    data: data.notifications || data.data || data,
  };
}
