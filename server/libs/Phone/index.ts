import crypto from 'crypto';

export const hashNumber = (number: string) => {
  return crypto.createHash('md5').update(number + process.env.NUMBER_SALT).digest("hex");
}
