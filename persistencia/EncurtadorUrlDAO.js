const SortedArray = require('sorted-array');
const Q = require('q');
const logger = require('../servicos/logger.js');

class EncurtadorUrlDAO {

    constructor(conexao) {
        this._conexao = conexao;
    }

    adiciona(alias, url) {
        this._conexao.HSET(alias, 'shortUrl', url);
        this._conexao.HSET(alias, 'contador', 0);
    }

    busca(alias, callback) {
        this._conexao.HGETALL(alias , (err, reply) => {
            if (err) {
                logger.info(err);
                throw new Error('Erro ao buscar url');
            }
            if (reply) {
                this._conexao.HINCRBY(alias, 'contador', 1);
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
        let top = SortedArray.comparing( obj => -parseInt(obj.contador), []);
        this._conexao.keys('*', (err, replies) => {
            replies.forEach( (reply, idx) => {
                this._conexao.HGETALL(reply , (err, ret) => {
                    top.insert(ret);
                    if(idx == replies.length - 1) {
                        return deferred.resolve(top.array.slice(0, 10));
                    }
                });
            });
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