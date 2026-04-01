
async function listModels() {
  const keys = [
    process.env.GOOGLE_GENERATED_AI_API_KEY,
    process.env.GOOGLE_AI_STUDIO_API_KEY,
    process.env.GEMINI_API_KEY
  ].filter(Boolean);

  if (keys.length === 0) {
    console.error("No API keys found in process.env");
    return;
  }

  for (const key of keys) {
    console.log(`Testing key: ${key?.substring(0, 5)}...`);
    for (const version of ['v1', 'v1beta']) {
      try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/${version}/models?key=${key}`);
        const data = await resp.json();
        if (data.models) {
          console.log(`SUCCESS [${version}]: Found ${data.models.length} models`);
          console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
          return;
        } else {
          console.log(`FAILED [${version}]:`, data.error?.message || "No models list");
        }
      } catch (e) {
        console.error(`ERROR [${version}]:`, e);
      }
    }
  }
}

listModels();
