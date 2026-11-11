import dotenv from 'dotenv';
import {Pool} from 'pg';

dotenv.config();

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 3000,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    max: 10
})

export default pool;



