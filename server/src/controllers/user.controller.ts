import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

type UserData = {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true
      } as const
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { username, email, password, firstName, lastName, phoneNumber } = req.body;
    
    const updates: {
      username?: string;
      email?: string;
      password?: string;
      firstName?: string | null;
      lastName?: string | null;
      phoneNumber?: string | null;
    } = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error: any) {
    console.error('Update profile error:', error);
    
    if (error?.code === 'P2002') { // Prisma unique constraint violation
      return res.status(400).json({ message: 'Email or username already in use' });
    }
    
    res.status(500).json({ 
      message: error?.message || 'An error occurred while updating the profile' 
    });
  }
};
