const jwt = require("jsonwebtoken");
import authConfig from '@config/auth'

const generateJWT = (data, options = {}) => {
  let { key, ...otherOptions }: any = options
  key = key || authConfig.SECRET_KEY
  return jwt.sign(data, key, otherOptions)
}
const decodeJWT = async (token, options = {}) => {
  let { key }: any = options
  key = key || authConfig.SECRET_KEY
  let result = await jwt.verify(token, key);
  return result
}
const verify = async (token, options = {}) => {
  let { key }: any = options
  key = key || authConfig.SECRET_KEY
  let result = await jwt.verify(token, key);
  return result
}

export default {
  generateJWT,
  decodeJWT,
  verify
}