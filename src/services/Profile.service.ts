import axios from "axios";

const base = import.meta.env.VITE_BASE_URL;


/** Fetches posts data. */
export async function getPosts(token:string|null, limit = 40, page = 1) {
    const { data } = await axios.get(`${base}/posts?limit=${limit}&page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    return { 
        data: data.data ? data.data.posts : [], 
        total: data.meta ? data.meta.pagination.total : 6978,
        success: data.success, 
        message: data.message 
    };   
}


/** Fetches user profile data. */
export async function getUserProfile(token: string | null) {
    const { data } = await axios.get(`${base}/users/profile-data`, {
        headers: {
            token: token
        }
    });
    
    return { 
        data: data.user || data.data?.user || data.data || data, 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Fetches user profile by id data. */
export async function getUserProfileById(token: string | null, userId: string) {
    const { data } = await axios.get(`${base}/users/${userId}/profile`, {
        headers: {
            token: token
        }
    });
    
    return { 
        data: data.user || data.data?.user || data.data || data, 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Fetches user posts data. */
export async function getUserPosts(token: string | null, userId: string, limit = 40, page = 1) {
    const { data } = await axios.get(`${base}/users/${userId}/posts?limit=${limit}&page=${page}`, {
        headers: {
            token: token
        }
    });
    
    return { 
        data: data.posts || data.data?.posts || data.data || [], 
        total: data.meta ? data.meta.pagination.total : 0,
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Fetches post comments data. */
export async function getPostComments(token: string | null, postId: string, limit = 10, page = 1) {
    const { data } = await axios.get(`${base}/posts/${postId}/comments?limit=${limit}&page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    return { 
        data: data.comments || (data.data && data.data.comments) || data.data || [], 
        total: data.meta ? data.meta.pagination.total : 0,
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Executes the create post comment API request. */
export async function createPostComment(token: string | null, postId: string, dataToSend: string | FormData) {
    const payload = typeof dataToSend === 'string' ? { content: dataToSend } : dataToSend;
    const { data } = await axios.post(`${base}/posts/${postId}/comments`, 
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    
    return { 
        data: data.comment || data.data?.comment || data.data || data, 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Executes the update post comment API request. */
export async function updatePostComment(token: string | null, postId: string, commentId: string, content: string) {
    const { data } = await axios.put(`${base}/posts/${postId}/comments/${commentId}`, 
        { content },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    
    return { 
        data: data.comment || data.data?.comment || data.data || data, 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Executes the delete post comment API request. */
export async function deletePostComment(token: string | null, postId: string, commentId: string) {
    const { data } = await axios.delete(`${base}/posts/${postId}/comments/${commentId}`, 
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    
    return { 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Executes the create post API request. */
export async function createPost(token: string | null, formData: FormData) {
    const { data } = await axios.post(`${base}/posts`, 
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    
    return { 
        data: data.post || data.data?.post || data.data || data, 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Executes the delete post API request. */
export async function deletePost(token: string | null, postId: string) {
    const { data } = await axios.delete(`${base}/posts/${postId}`, 
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    
    return { 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}



/** Executes the like post comment API request. */
export async function likePostComment(token: string | null, postId: string, commentId: string) {
    const { data } = await axios.put(`${base}/posts/${postId}/comments/${commentId}/like`, 
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    
    return { 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Executes the like post API request. */
export async function likePost(token: string | null, postId: string) {
    const { data } = await axios.put(`${base}/posts/${postId}/like`, 
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    
    return { 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Executes the share post API request. */
export async function sharePost(token: string | null, postId: string, body: string = "") {
    const { data } = await axios.post(`${base}/posts/${postId}/share`, 
        { body },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    
    return { 
        data: data.post || data.data?.post || data.data || data, 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Fetches notifications data. */
export async function getNotifications(token: string | null, unread: boolean = false, page: number = 1, limit: number = 10) {
    const { data } = await axios.get(`${base}/notifications?unread=${unread}&page=${page}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    return {
        success: data.message === "success" || data.success || true,
        data: data.notifications || data.data || data
    };
}


/** Fetches single post data. */
export async function getSinglePost(userToken: string | null, postId: string) {
    const { data } = await axios.request({
        url: `${base}/posts/${postId}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    return data;
}


/** Executes the update post API request. */
export async function updatePost(token: string | null, postId: string, formData: FormData) {
    const { data } = await axios.put(`${base}/posts/${postId}`, 
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    
    return { 
        data: data.post || data.data?.post || data.data || data, 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Executes the upload profile photo API request. */
export async function uploadProfilePhoto(token: string | null, formData: FormData) {
    const { data } = await axios.put(`${base}/users/profile-picture`, 
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    
    return { 
        data: data.user || data.data?.user || data.data || data, 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Executes the follow user API request. */
export async function followUser(token: string | null, userId: string) {
    const { data } = await axios.put(`${base}/users/${userId}/follow`, 
        {},
        {
            headers: {
                token: token
            }
        }
    );
    
    return { 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Executes the unfollow user API request. */
export async function unfollowUser(token: string | null, userId: string) {
    const { data } = await axios.delete(`${base}/users/${userId}/unfollow`, 
        {
            headers: {
                token: token
            }
        }
    );
    
    return { 
        success: data.message === "success" || data.success || true, 
        message: data.message 
    };   
}


/** Fetches suggested friends. */
export async function getSuggestedFriends(token: string | null, limit: number = 5) {
    if (!token) return { success: false, data: [] };
    try {
        const { data } = await axios.get(`${base}/users/suggestions?limit=${limit}`, {
            headers: {
                token: token,
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("Suggestions API Response:", data);

        const users = data?.data?.suggestions || [];

        return { 
            data: users.slice(0, limit), 
            success: data.message === "success" || data.success || true, 
            message: data.message 
        };
    } catch (error: any) {
        return { success: false, data: [], message: error.response?.data?.message || "Failed to fetch suggestions" };
    }
}
