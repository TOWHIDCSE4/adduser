import dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';

let env = dotenv.config({})
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);

export default {
  get: function (name, defaultValue = null) {
    return env[name] || defaultValue
  },

  all: function() {
    return env
  }
}
