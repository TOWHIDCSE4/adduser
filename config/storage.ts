import Env from '@core/Env';

export default {
  FILE_PATH: Env.get("MEDIA_IMAGE_PATH", "./public/media"),
  DOMAIN: Env.get("DOMAIN", "http://localhost"),
};
