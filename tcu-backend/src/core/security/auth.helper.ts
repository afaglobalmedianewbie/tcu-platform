import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CurrentUser } from './current-user.type';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: CurrentUser): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'tcu-secret-key', { expiresIn: '1d' });
};
