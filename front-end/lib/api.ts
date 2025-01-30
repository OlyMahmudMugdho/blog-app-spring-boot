import api from './axios'
import { Post, User, Comment, PaginatedResponse } from './types'

export const postsApi = {
  getAll: (page = 0, size = 10) =>
    api.get<PaginatedResponse<Post>>(`/posts?page=${page}&size=${size}&sort=createdAt,desc`),
  
  getFeed: (page = 0, size = 10) =>
    api.get<PaginatedResponse<Post>>(`/posts/feed?page=${page}&size=${size}&sort=createdAt,desc`),
  
  getByUser: (username: string, page = 0, size = 10) =>
    api.get<PaginatedResponse<Post>>(`/posts/user/${username}?page=${page}&size=${size}&sort=createdAt,desc`),
  
  getByTag: (tag: string, page = 0, size = 10) =>
    api.get<PaginatedResponse<Post>>(`/posts/tag/${tag}?page=${page}&size=${size}&sort=createdAt,desc`),
  
  search: (query: string, page = 0, size = 10) =>
    api.get<PaginatedResponse<Post>>(`/posts/search?query=${query}&page=${page}&size=${size}&sort=createdAt,desc`),
  
  get: (id: number) => 
    api.get<Post>(`/posts/${id}`),
  
  create: (data: { title: string; content: string; tags: string[]; coverImage?: string; published: boolean }) =>
    api.post<Post>('/posts', data),
  
  update: (id: number, data: { title: string; content: string; tags: string[]; coverImage?: string; published: boolean }) =>
    api.put<Post>(`/posts/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/posts/${id}`),
  
  like: (id: number) =>
    api.post(`/posts/${id}/like`),
  
  unlike: (id: number) =>
    api.delete(`/posts/${id}/like`),
  
  bookmark: (id: number) =>
    api.post(`/posts/${id}/bookmark`),
  
  unbookmark: (id: number) =>
    api.delete(`/posts/${id}/bookmark`)
}

export const usersApi = {
  getMe: () =>
    api.get<User>('/users/me'),
  
  getByUsername: (username: string) =>
    api.get<User>(`/users/${username}`),
  
  update: (id: number, data: {
    name?: string
    email?: string
    bio?: string
    profilePicture?: string
    newPassword?: string
    currentPassword?: string
  }) =>
    api.put<User>(`/users/${id}`, data),
  
  follow: (id: number) =>
    api.post(`/users/${id}/follow`),
  
  unfollow: (id: number) =>
    api.delete(`/users/${id}/unfollow`),
  
  getFollowers: (id: number) =>
    api.get<User[]>(`/users/${id}/followers`),
  
  getFollowing: (id: number) =>
    api.get<User[]>(`/users/${id}/following`)
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  register: (data: { username: string; name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword })
}