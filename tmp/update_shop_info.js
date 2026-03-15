const { Client } = require('pg');
const client = new Client({
  host: '127.0.0.1',
  port: 5433,
  user: 'meey_admin',
  password: 'meey_password',
  database: 'meey_nail_shop',
});
async function run() {
  await client.connect();
  const res = await client.query('UPDATE site_settings SET "shopEmail" = $1, "shopPhone" = $2 WHERE id IS NOT NULL', ['meeybouabdellah@gmail.com', '0775436562']);
  console.log('Update successful:', res.rowCount, 'rows affected');
  await client.end();
}
run().catch(err => { console.error(err); process.exit(1); });
