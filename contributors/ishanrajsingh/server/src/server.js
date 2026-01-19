import 'dotenv/config';

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 3000

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`SubSentry API running on port ${PORT}`);
  });
}

startServer();
