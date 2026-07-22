const PORT = process.env.PORT || 3001;

// Dev-only fallback secret — fine for a local demo, set a real JWT_SECRET env var for anything beyond local dev.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';

const JWT_EXPIRES_IN = '7d';

module.exports = { PORT, JWT_SECRET, JWT_EXPIRES_IN };
