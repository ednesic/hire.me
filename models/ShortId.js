class ShortId {

    static generate() {
        const alfabeto = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let alias = '';

        for (let idx = 0; idx < 6; idx++) {
            alias += alfabeto[Math.round(Math.random() * alfabeto.length)];
        }

        return alias;
    }
}

module.exports = function () {
    return ShortId;
};

/*
*
* O Math.random já tabalha com o tempo atual para gerar um número aleatório
*
 */