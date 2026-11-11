import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

interface SeedUser {
  email: string;
  name: string;
  password: string;
}

function parseSeedUsers(): SeedUser[] {
  const raw = process.env.SEED_USERS;
  if (raw) {
    try {
      return (JSON.parse(raw) as SeedUser[]).map((u) => ({
        email: String(u.email).toLowerCase(),
        name: u.name,
        password: u.password,
      }));
    } catch {
      console.error('SEED_USERS is not valid JSON, falling back to defaults');
    }
  }
  return [
    {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'Str0ng!Passw0rd',
    },
  ];
}

async function seed() {
  const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/easy-generator';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const users = db.collection('users');

  const seedUsers = parseSeedUsers();
  let inserted = 0;
  let skipped = 0;

  for (const { email, name, password } of seedUsers) {
    const exists = await users.findOne({ email });
    if (exists) {
      skipped += 1;
      continue;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({ email, name, passwordHash, createdAt: new Date(), updatedAt: new Date() });
    inserted += 1;
  }

  console.log(`Seed complete: ${inserted} inserted, ${skipped} skipped.`);
  await client.close();
}

if (process.env.NODE_ENV === 'production' && process.env.RUN_SEED_ON_START !== 'true') {
  console.log('Skipping seed in production.');
} else {
  seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
