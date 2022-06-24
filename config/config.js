module.exports = {
    // mongo bzw MONGO_IP ist hier die dns bezeichnung aus dem docker network und beinhaltet die ip vom mongo container
    // in docker-compose.yml wird sie unter volumes: <br/>mongo-db: definiert
    MONGO_IP: process.env.MONGO_IP || 'mongo',
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST || 'redis',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    SESSION_SECRET: process.env.SESSION_SECRET
}