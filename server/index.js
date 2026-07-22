const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');
const { PORT } = require('./config');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
