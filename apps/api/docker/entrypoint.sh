#!/bin/sh
set -e

echo "Waiting for MongoDB..."
until node -e "const m=require('mongodb'); new m.MongoClient(process.env.MONGO_URI).connect().then(c=>c.db().command({ping:1})).then(()=>process.exit(0)).catch(()=>process.exit(1))" >/dev/null 2>&1; do
  sleep 1
done
echo "MongoDB is up."

if [ "$RUN_SEED_ON_START" = "true" ]; then
  echo "Running seeder..."
  node dist/database/seed.js
fi

exec node dist/main.js
