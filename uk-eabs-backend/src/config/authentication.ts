// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default () => ({
  microservice: process.env.MICROSERVICE_IDENTIFIER,
  enviroment: process.env.ENVIRONMENT,
  secret: process.env.JWT_SECRET_KEY,
  accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  refreshTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
});
