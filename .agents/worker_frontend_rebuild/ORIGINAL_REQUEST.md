## 2026-07-05T20:07:19Z

You are the Worker agent. Your task is to reconstruct the missing public landing pages and authentication helper pages in the Next.js 16.2 client `frontend_new` using the App Router.

Your working directory is `/home/tcu/.agents/worker_frontend_rebuild`.

Please create the following pages in `/home/tcu/frontend_new/src/app`:
1. `/paket` (`src/app/paket/page.js`):
   - Design a page with glassmorphic cards using classes from `src/app/globals.css`.
   - Display two categories: "Paket Rumah" and "Paket Bisnis".
   - Pricing list:
     - Home 20 Mbps: Rp 200.000/bln (features: Unlimited, Free Instalasi). Pre-select tag redirects to `/login?tab=register&paket=20mbps` or legacy ID `cmqm0kbec000p14jamq7i6z7z`.
     - Home 50 Mbps: Rp 300.000/bln (features: Unlimited, Free Router). Pre-select tag redirects to `/login?tab=register&paket=50mbps` or legacy ID `cmqm0kbeg000q14jaebme6c1w`.
     - Business 100 Mbps: Rp 750.000/bln (features: IP Statik, SLA 99.5%, Prioritas Support). Pre-select tag redirects to `/login?tab=register&paket=100mbps` or legacy ID `cmqm0kbek000r14japoybmudo`.
2. `/coverage` (`src/app/coverage/page.js`):
   - A mock coverage checker page. Let the user search for a region (e.g. Pangandaran, Banjar, Ciamis, Tasikmalaya, Indramayu) and return a mock success message indicating network is active, or others indicating "planned expansion".
3. `/tentang` (`src/app/tentang/page.js`):
   - A page introducing "PT Top Class Universal" as a professional fiber optic provider with 24/7 technical support.
4. `/kontak` (`src/app/kontak/page.js`):
   - A page containing a contact form (Name, Email, Message) and company contact information (info@topclass.id, +62 823-1914-0858).
5. `/blog` (`src/app/blog/page.js`):
   - A list of blog posts. It must contain the article "Kemajuan Digitalisasi" or "Internet of Things (IoT)".
6. `/blog/[slug]` (`src/app/blog/[slug]/page.js`):
   - A dynamic route for blog posts. For slug `Kemajuan-Digitalisasi` (or matching title), display the parsed IoT article text:
     - Title: "Internet of Things (IoT)"
     - Subtitle: "Menghubungkan Dunia dengan Teknologi"
     - Content: Discuss what IoT is, examples of applications (Smart Home, Smart City, Health, Industry), benefits, and challenges. Make it look beautiful with glassmorphism classes.
7. `/login/otp` (`src/app/login/otp/page.js`):
   - Mock OTP entry form.
8. `/login/forgot-password` (`src/app/login/forgot-password/page.js`):
   - Mock forgot password email submission form.

Ensure all navbar and footer links across these new pages, as well as the main landing page (`src/app/page.js`), point to `/paket`, `/coverage`, `/tentang`, `/kontak`, `/blog`, `/login`, etc. instead of using `#hash` links when accessing from a separate page, or you can create a shared navbar layout component.
Verify that the Next.js application compiles successfully.

Deliver a handoff report at `/home/tcu/.agents/worker_frontend_rebuild/handoff.md` and send a message back to the orchestrator (conversation ID: 793a8de7-4803-406f-96e5-a9e4376cbecf) when done.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
