import { type Request } from 'express';
import { type JwtPayload } from 'jsonwebtoken';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: JwtPayload & { id: number };
}

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface UpdateProfileRequest extends Request {
  body: {
    name?: string;
    email?: string;
    password?: string;
  };
  user?: JwtPayload & { id: number };
}
