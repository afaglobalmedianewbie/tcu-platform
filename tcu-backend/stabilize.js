const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'server.js');
let code = fs.readFileSync(file, 'utf8');

// 1. Remove dangerous execSync
// We find the block from "let disk = {" to "catch (e) {}" and replace it.
const execSyncRegex = /let disk = \{ total: '100 GB'[\s\S]*?\} catch \(e\) \{\}/;
if (execSyncRegex.test(code)) {
  code = code.replace(execSyncRegex, `let disk = { total: '100 GB', used: '25 GB', free: '75 GB', percent: 25 };
    let containers = [];
    let networkConnections = 0;
    // Removed dangerous execSync calls for security baseline`);
}
code = code.replace(/const \{ execSync \} = require\('child_process'\);/g, '');

// 2. Replace weak random generator
code = code.replace(/Math\.floor\(Math\.random\(\) \*\s*([^\)]+)\)/g, 'crypto.randomInt(0, $1)');
code = code.replace(/100000 \+ Math\.random\(\) \* 900000/g, 'crypto.randomInt(100000, 1000000)');
code = code.replace(/Math\.random\(\)\.toString\(36\)/g, 'crypto.randomBytes(8).toString("hex")');

// 3. Enforce JWT_SECRET presence
code = code.replace(
  "const JWT_SECRET = process.env.JWT_SECRET || 'tcu_dev_fallback_DO_NOT_USE_IN_PRODUCTION';",
  "const JWT_SECRET = process.env.JWT_SECRET;\nif (!JWT_SECRET) { throw new Error('FATAL: JWT_SECRET MUST BE SET IN PRODUCTION'); }"
);

// 4 & 5. Enforce XENDIT_CALLBACK_TOKEN & XENDIT_API_KEY
code = code.replace(
  "const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;",
  "const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;\n  if (!expectedToken) throw new Error('CRITICAL: XENDIT_CALLBACK_TOKEN not set');"
);
code = code.replace(
  "const xenditApiKey = process.env.XENDIT_API_KEY;",
  "const xenditApiKey = process.env.XENDIT_API_KEY;\n    if (!xenditApiKey) throw new Error('CRITICAL: XENDIT_API_KEY not set');"
);

// 6. Restrict CORS
code = code.replace(
  /app\.use\(cors\(\{[\s\S]*?\}\)\);/,
  `app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://topclassuniversal.co.id', 'https://www.topclassuniversal.co.id'];
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));`
);

// 7. Limit pagination max to 100
// Find occurrences of `take: limit,` and `take: limit` and replace them.
// A safer way is to cap `limit` where it is parsed.
code = code.replace(
  /const limit = parseInt\(req\.query\.limit\) \|\| 10;/g,
  "const limit = Math.min(parseInt(req.query.limit) || 10, 100);"
);

// 8. Prevent null req.user crash
// Add a middleware early in the routes or replace `req.user.id` accesses with `req.user?.id`
code = code.replace(/req\.user\.id/g, 'req.user?.id');
code = code.replace(/req\.user\.role/g, 'req.user?.role');
code = code.replace(/req\.user\.customerProfile\.id/g, 'req.user?.customerProfile?.id');

// 9. Ensure health check returns 503 when DB is unhealthy
// We insert a health check endpoint before `app.use('/api', ...)` or at the end.
const healthCheckEndpoint = `
// GET /health
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw\`SELECT 1\`;
    res.status(200).json({ status: 'healthy' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});
`;
if (!code.includes('/health')) {
  code = code.replace('app.listen(port, () => {', healthCheckEndpoint + '\napp.listen(port, () => {');
}

// 10. Improve centralized error handling
const errorHandler = `
// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
`;
if (!code.includes('Centralized Error Handler')) {
  code = code.replace('app.listen(port, () => {', errorHandler + '\napp.listen(port, () => {');
}

fs.writeFileSync(file, code);
console.log('Stabilization script completed.');
