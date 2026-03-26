import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import logger from '../utils/logger.js';

export const startShift = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if there is already an active shift
    const activeShift = await prisma.shift.findFirst({
      where: {
        user_id: userId,
        end_time: null,
      },
    });

    if (activeShift) {
      return res.status(400).json({ error: 'There is already an active shift.' });
    }

    const newShift = await prisma.shift.create({
      data: {
        user_id: userId,
        start_time: new Date(),
      },
    });

    res.json(newShift);
  } catch (error) {
    logger.error('Error starting shift:', { error });
    res.status(500).json({ error: 'Failed to start shift' });
  }
};

export const endShift = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the active shift
    const activeShift = await prisma.shift.findFirst({
      where: {
        user_id: userId,
        end_time: null,
      },
      orderBy: {
        start_time: 'desc'
      }
    });

    if (!activeShift) {
      return res.status(400).json({ error: 'No active shift found.' });
    }

    const updatedShift = await prisma.shift.update({
      where: { id: activeShift.id },
      data: { end_time: new Date() },
    });

    res.json(updatedShift);
  } catch (error) {
    logger.error('Error ending shift:', { error });
    res.status(500).json({ error: 'Failed to end shift' });
  }
};

export const getCurrentShift = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const activeShift = await prisma.shift.findFirst({
      where: {
        user_id: userId,
        end_time: null,
      },
      orderBy: {
        start_time: 'desc'
      }
    });

    res.json({ currentShift: activeShift });
  } catch (error) {
    logger.error('Error getting current shift:', { error });
    res.status(500).json({ error: 'Failed to get current shift' });
  }
};
