const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: 'postgresql://neondb_owner:npg_8IB6YotGzPLx@ep-dark-hat-a1w02iay-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' 
});

async function run() {
  const artRes = await pool.query('SELECT slug, title FROM "Article"');
  console.log("--- EXISTING ARTICLES ---");
  artRes.rows.forEach(r => console.log(`Slug: ${r.slug} | Title: ${r.title}`));

  const confRes = await pool.query('SELECT * FROM "HeroConfig"');
  console.log("\n--- CURRENT HERO CONFIG ---");
  console.log(JSON.stringify(confRes.rows, null, 2));

  await pool.end();
}

run().catch(console.error);
