const User = require('../models/User');

const seedDefaultData = async () => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      console.log(`ℹ️ Database already contains ${count} users. Skipping default seeding.`);
      return;
    }

    console.log('🌱 Seeding initial demo users into database...');

    const defaultUsers = [
      {
        username: 'admin',
        email: 'admin@careernest.com',
        password: 'admin123',
        name: 'System Admin',
        role: 'admin'
      },
      {
        username: 'techcorp',
        email: 'techcorp@careernest.com',
        password: 'tech123',
        name: 'TechCorp Inc.',
        role: 'organization'
      },
      {
        username: 'student',
        email: 'student@careernest.com',
        password: 'student123',
        name: 'John Doe',
        role: 'student',
        rollNumber: 'STU001',
        course: 'Computer Science',
        year: 'Final Year'
      }
    ];

    for (const userData of defaultUsers) {
      const user = new User(userData);
      await user.save();
    }

    console.log('✅ Default demo users created successfully:');
    console.log('   - Admin: admin / admin123');
    console.log('   - Organization: techcorp / tech123');
    console.log('   - Student: student / student123');

  } catch (error) {
    console.error('❌ Error seeding default data:', error.message);
  }
};

module.exports = seedDefaultData;
