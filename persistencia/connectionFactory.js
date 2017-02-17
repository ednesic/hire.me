const redis = require("redis");

function criaConexaoDB() {
    return redis.createClient();
}

module.exports = function () {
    return criaConexaoDB;
};