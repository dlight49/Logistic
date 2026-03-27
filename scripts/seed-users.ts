import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding driver and customer...');
    const hashedPassword = await bcrypt.hash('TestPassword123!', 12);

    const driver = await prisma.user.upsert({
        where: { email: 'driver@logistics.com' },
        update: {
            password: hashedPassword,
            role: 'operator'
        },
        create: {
            email: 'driver@logistics.com',
            password: hashedPassword,
            name: 'Test Driver',
            role: 'operator',
            phone: '+1234567891',
            current_lat: 40.7128,
            current_lng: -74.0060,
        },
    });

    const customer = await prisma.user.upsert({
        where: { email: 'customer@logistics.com' },
        update: {
            password: hashedPassword,
            role: 'customer'
        },
        create: {
            email: 'customer@logistics.com',
            password: hashedPassword,
            name: 'Test Customer',
            role: 'customer',
            phone: '+1987654321',
        },
    });

    console.log('Created driver:', driver.email);
    console.log('Created customer:', customer.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
