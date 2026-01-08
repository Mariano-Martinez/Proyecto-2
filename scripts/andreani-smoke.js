const run = async () => {
  const numero = process.env.TRACKING_NUMBER || process.argv[2];
  if (!numero) {
    console.error('Uso: TRACKING_NUMBER=... npm run andreani:smoke o node scripts/andreani-smoke.js <numero>');
    process.exit(1);
  }

  const url = `http://localhost:3000/api/andreani/track?numero=${encodeURIComponent(numero)}`;
  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload?.ok === false) {
    console.error('Smoke test failed', payload);
    process.exit(1);
  }

  if (!payload?.data?.timelines?.length) {
    console.error('Smoke test failed: timelines vacío', payload);
    process.exit(1);
  }

  console.log(JSON.stringify(payload, null, 2));
};

run().catch((error) => {
  console.error('Smoke test error', error);
  process.exit(1);
});
