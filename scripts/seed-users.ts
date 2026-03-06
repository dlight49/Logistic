import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding driver and customer...');

    const driver = await prisma.user.upsert({
        where: { email: 'driver@logistics.com' },
        update: {},
        create: {
            id: 'driver-123',
            email: 'driver@logistics.com',
            name: 'Test Driver',
            role: 'driver',
            phone: '+1234567891',
            current_lat: 40.7128,
            current_lng: -74.0060,
        },
    });

    const customer = await prisma.user.upsert({
        where: { email: 'customer@logistics.com' },
        update: {},
        create: {
            id: 'customer-123',
            email: 'customer@logistics.com',
            name: 'Test Customer',
            role: 'customer',
            phone: '+1987654321',
        },
    });

    console.log('Created driver:', driver);
    console.log('Created customer:', customer);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
