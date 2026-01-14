const parseArgs = (args: string[]) => {
  const output: Record<string, string> = {};
  args.forEach((arg) => {
    if (!arg.startsWith('--')) return;
    const [key, value] = arg.slice(2).split('=');
    if (key && value) output[key] = value;
  });
  return output;
};

const args = parseArgs(process.argv.slice(2));
const carrier = args.carrier || process.env.CARRIER || '';
const trackingNumber = args.trackingNumber || process.env.TRACKING_NUMBER || '';

if (!carrier || !trackingNumber) {
  console.error('Uso: npm run tracking:smoke -- --carrier=andreani --trackingNumber=NUMERO');
  process.exit(1);
}

const url = new URL('http://localhost:3000/api/tracking/refresh');
url.searchParams.set('carrier', carrier);
url.searchParams.set('trackingNumber', trackingNumber);

const run = async () => {
  const response = await fetch(url.toString());
  const payload = await response.json().catch(() => ({}));
  console.log(JSON.stringify(payload, null, 2));
  if (!response.ok || payload?.ok !== true) {
    process.exit(1);
  }
  if (!payload?.data?.events || payload.data.events.length === 0) {
    console.error('No se encontraron eventos en la respuesta.');
    process.exit(1);
  }
};

run().catch((error) => {
  console.error('Error ejecutando smoke test', error);
  process.exit(1);
});
