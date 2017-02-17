class RetornoBuilder {

    constructor() {
        this._retorno = {};
    }

    adicionaAlias(alias) {
        this._retorno.alias = alias;
        return this;
    }

    adicionaUrl(url) {
        this._retorno.url = url;
        return this;
    }

    adicionaStatistics(statistics) {
        this._retorno.statistics = statistics;
        return this;
    }

    adicionaErro(erro, descricao) {
        this._retorno.err_code = erro;
        this._retorno.description = descricao;
        return this;
    }

    buildJson(){
        return this._retorno;
    }
}

module.exports = function () {
    return RetornoBuilder;
};