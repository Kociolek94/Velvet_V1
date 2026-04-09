21:00:00.707 Running build in Washington, D.C., USA (East) – iad1
21:00:00.708 Build machine configuration: 2 cores, 8 GB
21:00:00.828 Cloning github.com/Kociolek94/Velvet_V1 (Branch: main, Commit: 9632c1f)
21:00:00.829 Previous build caches not available.
21:00:02.086 Cloning completed: 1.256s
21:00:02.449 Running "vercel build"
21:00:03.128 Vercel CLI 50.42.0
21:00:03.404 Installing dependencies...
21:00:23.097 
21:00:23.098 added 572 packages in 19s
21:00:23.098 
21:00:23.098 223 packages are looking for funding
21:00:23.098   run `npm fund` for details
21:00:23.445 Detected Next.js version: 16.2.1
21:00:23.454 Running "npm run build"
21:00:23.675 
21:00:23.676 > velvet@0.1.0 build
21:00:23.676 > next build
21:00:23.676 
21:00:24.664 Attention: Next.js now collects completely anonymous telemetry regarding usage.
21:00:24.664 This information is used to shape Next.js' roadmap and prioritize features.
21:00:24.664 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
21:00:24.664 https://nextjs.org/telemetry
21:00:24.664 
21:00:25.058 ▲ Next.js 16.2.1 (Turbopack)
21:00:25.059 
21:00:25.091   Creating an optimized production build ...
21:00:47.489 ✓ Compiled successfully in 22.1s
21:00:47.493   Running TypeScript ...
21:00:57.145 Failed to type check.
21:00:57.146 
21:00:57.147 ./src/lib/actions/velvet_engine.ts:97:7
21:00:57.147 Type error: Object literal may only specify known properties, and 'maxTokens' does not exist in type 'CallSettings & { system?: string | SystemModelMessage | SystemModelMessage[] | undefined; } & { prompt: string | ModelMessage[]; messages?: undefined; } & { ...; }'.
21:00:57.147 
21:00:57.147   [90m 95 |[0m       prompt: prompt,
21:00:57.147   [90m 96 |[0m       temperature: [35m0.7[0m,
21:00:57.147 [31m[1m>[0m [90m 97 |[0m       maxTokens: [35m1000[0m,
21:00:57.147   [90m    |[0m       [31m[1m^[0m
21:00:57.147   [90m 98 |[0m     });
21:00:57.147   [90m 99 |[0m
21:00:57.148   [90m100 |[0m     console.log([32m'--- VELVET ENGINE AI RESPONSE ---'[0m, text);
21:00:57.196 Next.js build worker exited with code: 1 and signal: null
21:00:57.243 Error: Command "npm run build" exited with 1