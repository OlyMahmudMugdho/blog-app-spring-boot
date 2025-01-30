export interface User {
  id: number
  username: string
  name: string
  email: string
  bio?: string
  profilePicture?: string
  followers?: number
  following?: number
}

export interface Post {
  id: number
  title: string
  content: string
  author: {
    name: string
    username: string
    profilePicture?: string
  }
  createdAt: string
  updatedAt?: string
  tags: string[]
  likes: number
  comments: number
  coverImage?: string
  published: boolean
  bookmarked?: boolean
  liked?: boolean
}

export interface Comment {
  id: number
  content: string
  author: {
    name: string
    username: string
    profilePicture?: string
  }
  createdAt: string
  likes: number
}

export interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
}