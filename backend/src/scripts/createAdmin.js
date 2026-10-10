import readline from 'readline';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const nextVal = args[i + 1];
      if (nextVal && !nextVal.startsWith('--')) {
        parsed[key] = nextVal;
        i++;
      } else {
        parsed[key] = true;
      }
    }
  }
  return parsed;
}

function promptQuestion(rl, query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('==============================================');
  console.log('🔒 Portfolio Backend: Admin Account Setup');
  console.log('==============================================\n');

  const cliArgs = parseArgs();
  let email = cliArgs.email || process.env.ADMIN_EMAIL;
  let password = cliArgs.password || process.env.ADMIN_PASSWORD;
  let name = cliArgs.name || process.env.ADMIN_NAME;

  if (!email || !password) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      if (!name) {
        name = (await promptQuestion(rl, 'Enter Admin Full Name [Anushree R]: ')).trim() || 'Anushree R';
      }
      if (!email) {
        email = (await promptQuestion(rl, 'Enter Admin Email: ')).trim();
      }
      if (!password) {
        password = (await promptQuestion(rl, 'Enter Secure Password (min 8 characters): ')).trim();
      }
    } finally {
      rl.close();
    }
  }

  if (!email || !email.includes('@')) {
    console.error('❌ Error: A valid email address is required.');
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();
  console.log(`\n⏳ Hashing password and creating admin record for ${normalizedEmail}...`);

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: normalizedEmail },
    update: {
      name: name || 'Admin',
      passwordHash,
    },
    create: {
      email: normalizedEmail,
      name: name || 'Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created or updated successfully!');
  console.log(`   ID:    ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name:  ${admin.name}`);
  console.log(`   Role:  ${admin.role}\n`);
}

main()
  .catch((err) => {
    console.error('❌ Error creating admin user:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

