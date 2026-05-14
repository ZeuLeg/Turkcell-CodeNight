import 'dotenv/config';
import { createApp } from './app';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const app = createApp();

    app.listen(PORT, () => {
      console.log(`[Backend] Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[Backend] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();