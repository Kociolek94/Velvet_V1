20:50:50.193 Running build in Washington, D.C., USA (East) – iad1
20:50:50.194 Build machine configuration: 2 cores, 8 GB
20:50:50.378 Cloning github.com/Kociolek94/Velvet_V1 (Branch: main, Commit: 2568c1c)
20:50:50.379 Previous build caches not available.
20:50:51.923 Cloning completed: 1.545s
20:50:52.794 Running "vercel build"
20:50:53.489 Vercel CLI 50.42.0
20:50:53.979 Installing dependencies...
20:51:13.313 
20:51:13.313 added 572 packages in 19s
20:51:13.314 
20:51:13.314 223 packages are looking for funding
20:51:13.314   run `npm fund` for details
20:51:13.401 Detected Next.js version: 16.2.1
20:51:13.411 Running "npm run build"
20:51:13.518 
20:51:13.519 > velvet@0.1.0 build
20:51:13.519 > next build
20:51:13.520 
20:51:14.036 Attention: Next.js now collects completely anonymous telemetry regarding usage.
20:51:14.037 This information is used to shape Next.js' roadmap and prioritize features.
20:51:14.037 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
20:51:14.038 https://nextjs.org/telemetry
20:51:14.038 
20:51:14.065 ▲ Next.js 16.2.1 (Turbopack)
20:51:14.066 
20:51:14.100   Creating an optimized production build ...
20:51:36.211 ✓ Compiled successfully in 21.8s
20:51:36.211   Running TypeScript ...
20:51:45.689 Failed to type check.
20:51:45.689 
20:51:45.690 ./src/lib/actions/velvet_engine.ts:97:7
20:51:45.691 Type error: Object literal may only specify known properties, and 'maxTokens' does not exist in type 'CallSettings & { system?: string | SystemModelMessage | SystemModelMessage[] | undefined; } & { prompt: string | ModelMessage[]; messages?: undefined; } & { ...; }'.
20:51:45.691 
20:51:45.691   [90m 95 |[0m       prompt: prompt,
20:51:45.691   [90m 96 |[0m       temperature: [35m0.7[0m,
20:51:45.692 [31m[1m>[0m [90m 97 |[0m       maxTokens: [35m1000[0m,
20:51:45.692   [90m    |[0m       [31m[1m^[0m
20:51:45.692   [90m 98 |[0m     });
20:51:45.692   [90m 99 |[0m
20:51:45.692   [90m100 |[0m     console.log([32m'--- VELVET ENGINE AI RESPONSE ---'[0m, text);
20:51:45.736 Next.js build worker exited with code: 1 and signal: null
20:51:45.783 Error: Command "npm run build" exited with 1