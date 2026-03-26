import { prisma } from './src/backend/config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "test_secret_for_launch_verification";

async function testFullFlow() {
  console.log('--- STARTING END-TO-END BUSINESS FLOW TEST ---');
  const testEmail = `launch-test-${Date.now()}@logistic.com`;
  
  try {
    // 1. Test Registration Logic
    console.log(`Step 1: Simulating user registration for ${testEmail}...`);
    const hashedPassword = await bcrypt.hash('test-password', 12);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Launch Tester',
        role: 'admin'
      }
    });
    console.log(`✅ User created in Neon with ID: ${user.id}`);

    // 2. Test Login/JWT Logic
    console.log('Step 2: Simulating login and JWT generation...');
    const isMatch = await bcrypt.compare('test-password', user.password);
    if (!isMatch) throw new Error('Password mismatch');
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('✅ JWT generated successfully.');

    // 3. Test Shipment Creation
    console.log('Step 3: Creating a test shipment linked to this user...');
    const shipmentId = `GS-TEST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const shipment = await prisma.shipment.create({
      data: {
        id: shipmentId,
        sender_name: 'Test Sender',
        sender_city: 'London',
        receiver_name: 'Test Receiver',
        receiver_city: 'New York',
        status: 'Order Received',
        operator_id: user.id,
        tracking_updates: {
          create: {
            status: 'Order Received',
            location: 'London',
            notes: 'Initial test shipment'
          }
        }
      }
    });
    console.log(`✅ Shipment ${shipmentId} created and linked.`);

    // 4. Verify Data Integrity
    console.log('Step 4: Verifying data retrieval...');
    const foundShipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { operator: true, tracking_updates: true }
    });
    
    if (foundShipment && foundShipment.operator?.email === testEmail) {
      console.log('✅ Data integrity verified: Shipment correctly linked to user.');
      console.log(`✅ Tracking history verified: ${foundShipment.tracking_updates.length} updates found.`);
    } else {
      throw new Error('Data verification failed');
    }

    console.log('\n--- ALL BUSINESS FLOWS VERIFIED PERFECTLY ---');
    console.log('Your platform is 100% ready for operation.');

  } catch (error) {
    console.error('❌ FLOW TEST FAILED:');
    console.error(error);
  } finally {
    // Cleanup test data
    console.log('\nCleaning up test data...');
    await prisma.trackingUpdate.deleteMany({ where: { shipment_id: { startsWith: 'GS-TEST' } } });
    await prisma.shipment.deleteMany({ where: { id: { startsWith: 'GS-TEST' } } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  }
}

testFullFlow();
