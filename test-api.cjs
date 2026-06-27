const API_BASE = 'https://kellogg-api.aimeexiang239.workers.dev';

async function test() {
  try {
    console.log('Testing API connection...');
    const res = await fetch(`${API_BASE}/api/config/pages`);
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Pages found:', data.length);
    const home = data.find(p => p.path === '/');
    console.log('Homepage found:', !!home);
    if (home) {
      console.log('Homepage ID:', home.id);
      const detailRes = await fetch(`${API_BASE}/api/config/pages/${home.id}`);
      const detail = await detailRes.json();
      console.log('Homepage blocks:', detail.blocks?.length || 0);
      console.log('First block type:', detail.blocks?.[0]?.type);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
