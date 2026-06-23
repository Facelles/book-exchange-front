export interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  name?: string;
  avatarUrl?: string;
}

export interface ExchangeRequest {
  id: number;
  senderId: number;
  receiverId: number;
  bookId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  sender?: User;
  book?: Book;
}

export interface Book {
  id: number;
  name: string;
  author: string;
  photoUrl: string | null;
  ownerId: number;
  owner?: {
    id: number;
    email: string;
  };
}

export interface BooksResponse {
  total: number;
  limit: number;
  offset: number;
  data: Book[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AdminUser extends User {
  createdAt?: string;
}

export interface AddUserForm {
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export interface AddBookForm {
  name: string;
  author: string;
  photoUrl: string;
}
