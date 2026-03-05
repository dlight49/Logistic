import { Router } from 'express';
import { prisma } from '../config/db.js';

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { id: email }]
            }
        });

        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
