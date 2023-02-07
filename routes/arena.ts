const Arena = require('bull-arena');
import Route from '@core/Routes'
import Bull from 'bull'
const AuthApiMiddleware = require('@app/Middlewares/AuthApiMiddleware');

const arena = async () => {
  if (process.env.MODE == "dev-client") return;
  let queues = [
    {
      name: `PDPC-API`,
      hostId: "localhost",
      type: 'bull',
      redis: {
        port: Number(process.env.REDIS_PORT) || 6379, // Redis port
        host: process.env.REDIS_HOST || "127.0.0.1", // Redis host
        password: process.env.REDIS_PASS,
        db: Number(process.env.REDIS_DB) || 0,
      }
    }
  ]

  let arenaQ = Arena({
    Bull,
    queues: queues,
  },
  {
      // Make the arena dashboard become available at {my-site.com}/arena.
      basePath: '/',

      // Let express handle the listening.
      disableListen: true
  });
  Route.router.use("/arena", AuthApiMiddleware, arenaQ);
}
arena();
