export default {
  DB_TYPE: process.env.DB_TYPE || "pg",
  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_PORT: process.env.DB_PORT || "5432",
  DB_USER: process.env.DB_USER || "root",
  DB_PASS: process.env.DB_PASS || "123456",
  DB_NAME: process.env.DB_NAME || "root",
  DB_POOL_SIZE: process.env.DB_POOL_SIZE || 10,
};
