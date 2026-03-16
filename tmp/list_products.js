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
  const res = await client.query('SELECT name, price, "isFeatured", "isNew", "badge" FROM products WHERE "isActive" = true');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
run().catch(err => { console.error(err); process.exit(1); });
