import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeUserAdmin(email) {
    try {
        console.log(`=== Elevating user to Admin role: ${email} ===`);
        
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'admin' }
        });

        console.log(`✅ Success! User ${user.name} (${user.email}) is now an Admin.`);
    } catch (e) {
        if (e.code === 'P2025') {
            console.error(`❌ Error: User with email "${email}" not found in database.`);
        } else {
            console.error("❌ Unexpected Error:", e);
        }
    } finally {
        await prisma.$disconnect();
    }
}

const targetEmail = process.argv[2] || 'admin@logistics.com';
makeUserAdmin(targetEmail);
