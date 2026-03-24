import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const createDB = async () => {
  // Use a default database like 'postgres' to connect and create the new one
  const connectionString = process.env.DATABASE_URL.replace('/vorcas_db', '/postgres');
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to postgres database');
    
    // Check if database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='vorcas_db'");
    
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE vorcas_db');
      console.log('Database "vorcas_db" created successfully.');
    } else {
      console.log('Database "vorcas_db" already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await client.end();
  }
};

createDB();
