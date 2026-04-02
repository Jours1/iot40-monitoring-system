/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Backend Config
 * ═══════════════════════════════════════════════════════════════
 */
require('dotenv').config();
const defaults = require('../../../../shared/config/defaults');

module.exports = {
  port: parseInt(process.env.PORT, 10) || defaults.BACKEND_PORT,
  mongoUri: process.env.MONGO_URI || defaults.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
  defaultLimit: defaults.DEFAULT_LIMIT,
  maxLimit: defaults.MAX_LIMIT,
};
