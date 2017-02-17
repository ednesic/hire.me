// const shortid = require('shortid');
const isURLvalid = require('valid-url').isWebUri;
const path = require('path');

module.exports = function (app) {

    app.put('/create', (req, res) => {
        const comecoCronometro = new Date().getTime();

        const dadosUrl = new app.models.DadosUrl(req.query);

        if(dadosUrl.isUrlEmpty()) {
            return res.status(400).send(
                new app.models.RetornoBuilder()
                    .adicionaErro('003', 'No URL to be shorten provided.')
                    .buildJson());
        }

        if(!isURLvalid(dadosUrl.url)) {
            return res.status(400).send(
                new app.models.RetornoBuilder()
                    .adicionaErro('004', 'Url is no valid')
                    .buildJson());
        }

        const connection = app.persistencia.connectionFactory();
        const encurtadorUrlDAO = new app.persistencia.EncurtadorUrlDAO(connection);

        const customAlias = dadosUrl.CUSTOM_ALIAS;

        // let urlShortId = customAlias ? customAlias : shortid.generate();
        let urlShortId = customAlias ? customAlias : app.models.ShortId.generate();

        encurtadorUrlDAO.verificaExisteAlias(urlShortId, resposta => {
            if(resposta) {
                app.servicos.logger.info('Retornada url existe com hash:' + urlShortId);
                return res.status(400).send(
                    new app.models.RetornoBuilder()
                        .adicionaAlias(urlShortId)
                        .adicionaErro('001', 'CUSTOM ALIAS ALREADY EXISTS.')
                        .buildJson());
            } else {
                app.servicos.logger.info('Gerando URL encurtada com hash:' + urlShortId);
                encurtadorUrlDAO.adiciona(urlShortId, dadosUrl.url);
                res.status(200).send(
                    new app.models.RetornoBuilder()
                        .adicionaAlias(urlShortId)
                        .adicionaUrl(`${req.headers.host}/u/${urlShortId}`)
                        .adicionaStatistics({time_taken:`${new Date().getTime() - comecoCronometro} ms`})
                        .buildJson());
                encurtadorUrlDAO.fechaConexao();
            }
        });
    });

    app.get('/u/:alias', (req, res) => {

        const connection = app.persistencia.connectionFactory();
        const encurtadorUrlDAO = new app.persistencia.EncurtadorUrlDAO(connection);

        encurtadorUrlDAO.busca(req.params.alias, resposta => {
            if(!resposta) {
                app.servicos.logger.info(`Url com hash '${req.params.alias}' não existe`);
                return res.status(404).send(
                    new app.models.RetornoBuilder()
                        .adicionaErro('002', 'SHORTENED URL NOT FOUND.')
                        .buildJson());
            }
            encurtadorUrlDAO.fechaConexao();
            app.servicos.logger.info(`Redirecionando para ${resposta}`);
            return res.redirect(resposta);
        });
    });

    app.get('/top10', (req, res) => {

        const connection = app.persistencia.connectionFactory();
        const encurtadorUrlDAO = new app.persistencia.EncurtadorUrlDAO(connection);
        encurtadorUrlDAO.retornaContagens()
            .then( top10 => {
                encurtadorUrlDAO.fechaConexao();
                return res.status(200).send(top10);
            });
    });

    app.get('/', (req, res) => {
        res.sendFile(path.resolve('public/html/index.html'));
    });
};