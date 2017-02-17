class DadosUrl {

    constructor(dados){
        this._CUSTOM_ALIAS = dados.CUSTOM_ALIAS;
        this._url = dados.url;
    }

    get CUSTOM_ALIAS() {
        return this._CUSTOM_ALIAS;
    }

    get url() {
        return this._url;
    }

    set CUSTOM_ALIAS(value) {
        this._CUSTOM_ALIAS = value;
    }

    isUrlEmpty() {
        return !this._url;
    }

}

module.exports = function () {
    return DadosUrl;
};