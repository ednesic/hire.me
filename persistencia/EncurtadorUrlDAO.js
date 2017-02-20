const Q = require('q');
const logger = require('../servicos/logger.js');

class EncurtadorUrlDAO {

    constructor(conexao) {
        this._conexao = conexao;
    }

    adiciona(alias, url) {
        this._conexao.HSET(alias, 'shortUrl', url);
        this._conexao.ZADD(['contador', 0, alias], function(err) {
            if (err) { throw err }
        });
    }

    busca(alias, callback) {
        this._conexao.HGETALL(alias , (err, reply) => {
            if (err) {
                logger.info(err);
                throw new Error('Erro ao buscar url');
            }
            if (reply) {
                this._conexao.ZINCRBY(['contador', 1, alias], err => {
                    if (err) { throw err }
                });
                callback(reply.shortUrl);
            } else {
                callback(null);
            }
        });
    }

    verificaExisteAlias(alias, callback) {
        this._conexao.HGETALL(alias , (err, replies) => {
            if (err) {
                logger.info(err);
                throw new Error('Erro ao verificar Alias');
            }
            return callback(replies);
        });
    }

    retornaContagens() {
        const deferred = Q.defer();

        this._conexao.ZREVRANGE(['contador', 0, 9, 'WITHSCORES'], (err, response) => {
            if (err) { throw err }
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    fechaConexao() {
        this._conexao.quit();
    }
}

module.exports = function () {
    return EncurtadorUrlDAO;
};