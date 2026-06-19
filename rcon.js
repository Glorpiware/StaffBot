const Rcon = require('rcon-srcds').default;
const ENV = process.env;

module.exports = async () => {
    const server = new Rcon({
        host: ENV.RCON_HOST, port: ENV.RCON_PORT
    });

    await server.authenticate(ENV.RCON_PASS);

    return server;
};