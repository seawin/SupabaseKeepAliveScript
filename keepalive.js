
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import projects from './projects.json' with { type: 'json' };

async function ping(name, urlKey, envKey) {
  const key = process.env[envKey];
  if (!key) {
    console.warn(`[⚠️] Skipping ${name} – no key set for env var ${envKey}`);
    return;
  } else if (key === 'unused') {
    console.warn(`[⚠️] Skipping ${name} – key for env var ${envKey} is marked as unused`);
    return;
  } else {
    console.log(`[🔑] Using key from env var ${envKey}`);
  }

  const url = process.env[urlKey];
  if (!url) {
    console.warn(`[⚠️] Skipping ${name} – no URL set for env var ${urlKey}`);
    return;
  } else if (url === 'unused') {
    console.warn(`[⚠️] Skipping ${name} – URL for env var ${urlKey} is marked as unused`);
    return;
  } else {
    console.log(`[🔑] Using URL from env var ${urlKey}`);
  }

  const supabase = createClient(url, key);

  try {
    const { error } = await supabase.from('wakeup').select('id').limit(1);
    if (error) throw error;
    console.log(`[✅] ${name} is awake (${new Date().toISOString()})`);
  } catch (err) {
    console.error(`[❌] ${name} failed to wake: ${err.message}`);
  }
}

async function run() {
  console.log(`[🌐] Starting keep-alive ping...`);
  console.log('----------------------------------------');
  for (const project of projects) {
    await ping(project.name, project.urlKey, project.envKey);
    console.log('----------------------------------------');
  }
}

run();
