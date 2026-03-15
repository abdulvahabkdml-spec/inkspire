const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: 'postgresql://neondb_owner:npg_8IB6YotGzPLx@ep-dark-hat-a1w02iay-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' 
});

async function run() {
  console.log('Cleaning up HeroConfig...');
  
  // Get valid slugs first to be sure
  const artRes = await pool.query('SELECT slug FROM "Article" LIMIT 2');
  const validSlugs = artRes.rows.map(r => r.slug);
  
  if (validSlugs.length < 2) {
    console.log("Not enough articles to set a full hero config.");
    await pool.end();
    return;
  }

  const res = await pool.query(
    'UPDATE "HeroConfig" SET "articleSlug" = $1, "secondarySlug" = $2 WHERE id IN (SELECT id FROM "HeroConfig" LIMIT 1)', 
    [validSlugs[0], validSlugs[1]]
  );

  console.log(`Successfully set HeroConfig to: Primary=${validSlugs[0]}, Secondary=${validSlugs[1]}`);
  await pool.end();
}

run().catch(e => { 
  console.error(e); 
  process.exit(1); 
});
