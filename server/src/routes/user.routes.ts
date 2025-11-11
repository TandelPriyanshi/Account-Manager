import { Router } from 'express';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.middleware.ts';
import { prisma } from '../lib/prisma.ts';
import type { AuthRequest } from '../types/index.ts';

const router = Router();

// Get current user profile
router.get('/me', auth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
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
});

// Update user profile
router.put('/me', auth, async (req: AuthRequest, res) => {
  try {
    const { username, email, password, firstName, lastName, phoneNumber } = req.body;
    const updates: {
      username?: string;
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
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
      where: { id: req.user?.id },
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
  } catch (error: unknown) {
    console.error('Update profile error:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') { // Prisma unique constraint violation
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
});

export default router;
