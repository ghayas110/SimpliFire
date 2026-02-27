const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:Simplifire%403844@db.gdkzexbaznrbnsntsfob.supabase.co:5432/postgres',
});

async function run() {
    try {
        await client.connect();
        console.log('Connected carefully to DB');
        const res = await client.query('SELECT NOW()');
        console.log('Result:', res.rows);
    } catch (e) {
        console.error('Connection error:', e);
    } finally {
        await client.end();
    }
}

run();
