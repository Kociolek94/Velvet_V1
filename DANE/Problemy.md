21:05:56.715 Running build in Washington, D.C., USA (East) – iad1
21:05:56.716 Build machine configuration: 2 cores, 8 GB
21:05:56.883 Cloning github.com/Kociolek94/Velvet_V1 (Branch: main, Commit: f8aec11)
21:05:56.884 Previous build caches not available.
21:05:58.216 Cloning completed: 1.333s
21:05:58.592 Running "vercel build"
21:05:59.249 Vercel CLI 50.42.0
21:05:59.519 Installing dependencies...
21:06:18.366 
21:06:18.367 added 572 packages in 19s
21:06:18.367 
21:06:18.367 223 packages are looking for funding
21:06:18.368   run `npm fund` for details
21:06:18.718 Detected Next.js version: 16.2.1
21:06:18.727 Running "npm run build"
21:06:18.848 
21:06:18.849 > velvet@0.1.0 build
21:06:18.849 > next build
21:06:18.849 
21:06:19.751 Attention: Next.js now collects completely anonymous telemetry regarding usage.
21:06:19.752 This information is used to shape Next.js' roadmap and prioritize features.
21:06:19.752 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
21:06:19.752 https://nextjs.org/telemetry
21:06:19.752 
21:06:19.779 ▲ Next.js 16.2.1 (Turbopack)
21:06:19.780 
21:06:19.812   Creating an optimized production build ...
21:06:41.608 ✓ Compiled successfully in 21.5s
21:06:41.610   Running TypeScript ...
21:06:51.043 Failed to type check.
21:06:51.044 
21:06:51.044 ./supabase/functions/send-notification-email/index.ts:1:23
21:06:51.044 Type error: Cannot find module 'https://deno.land/std@0.168.0/http/server.ts' or its corresponding type declarations.
21:06:51.044 
21:06:51.044 [31m[1m>[0m [90m1 |[0m [36mimport[0m { serve } [36mfrom[0m [32m"https://deno.land/std@0.168.0/http/server.ts"[0m
21:06:51.044   [90m  |[0m                       [31m[1m^[0m
21:06:51.044   [90m2 |[0m [36mimport[0m { createClient } [36mfrom[0m [32m"https://esm.sh/@supabase/supabase-js@2"[0m
21:06:51.044   [90m3 |[0m
21:06:51.044   [90m4 |[0m [36mconst[0m [33mBREVO_API_KEY[0m = [33mDeno[0m.env.get([32m'BREVO_API_KEY'[0m)
21:06:51.091 Next.js build worker exited with code: 1 and signal: null
21:06:51.136 Error: Command "npm run build" exited with 1