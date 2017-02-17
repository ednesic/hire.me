const test = require('tape');
const http = require('http');

const host = process.env.host;
const port = process.env.port;
// const shortid = require('shortid');
const shortid = require('../models/ShortId.js')();
const shortIdInvalida = 'abcdef_';
const urlCorreta = 'http://google.com';
const urlCorreta2 = 'http://yahoo.com';
const urlInvalida = 'h/google.com';

test('Adiciona com url e sem CUSTOM_ALIAS', t => {
    t.plan(2);
    http.get({
        hostname: host,
        port: port,
        method: 'PUT',
        path: `/create?url=${urlCorreta}`,
    }, response => {
        response.on('data', data => {
            t.equal(response.statusCode, 200);
            const parsedData = JSON.parse(data);
            t.notEqual(parsedData.alias, null);
        })
    })
});

test('Adiciona com url e com CUSTOM_ALIAS', t => {
    t.plan(2);
    const gen = shortid.generate();
    http.get({
        hostname: host,
        port: port,
        method: 'PUT',
        path: `/create?url=${urlCorreta}&CUSTOM_ALIAS=${gen}`,
    }, response => {
        response.on('data', data => {
            t.equal(response.statusCode, 200);
            const parsedData = JSON.parse(data);
            t.equal(parsedData.alias, gen);
        })
    })
});

test('Adiciona com url e sem CUSTOM_ALIAS e adquire url', t => {
    t.plan(4);
    http.get({
        hostname: host,
        port: port,
        method: 'PUT',
        path: `/create?url=${urlCorreta}`,
    }, response => {
        response.on('data', data => {
            t.equal(response.statusCode, 200);
            const parsedData = JSON.parse(data);
            t.notEqual(parsedData.alias, null);

            http.get({
                hostname: host,
                port: port,
                path: `/u/${parsedData.alias}`,
            }, response2 => {
                response2.on('data', data => {
                    t.equal(response2.statusCode, 302);
                    t.equal(response2.headers.location, urlCorreta);
                })
            })
        })
    })
});

test('Adiciona com url e com CUSTOM_ALIAS e adquire url', t => {
    t.plan(4);
    const gen = shortid.generate();
    http.get({
        hostname: host,
        port: port,
        method: 'PUT',
        path: `/create?url=${urlCorreta2}&CUSTOM_ALIAS=${gen}`,
    }, response => {
        response.on('data', data => {
            t.equal(response.statusCode, 200);
            const parsedData = JSON.parse(data);
            t.equal(parsedData.alias, gen);

            http.get({
                hostname: host,
                port: port,
                path: `/u/${gen}`,
            }, response2 => {
                response2.on('data', data => {
                    t.equal(response2.statusCode, 302);
                    t.equal(response2.headers.location, urlCorreta2);
                })
            })
        })
    })
});

test('Adiciona sem url e sem CUSTOM_ALIAS', t => {
    t.plan(3);
    http.get({
        hostname: host,
        port: port,
        method: 'PUT',
        path: `/create`,
    }, response => {
        response.on('data', data => {
            t.equal(response.statusCode, 400);
            const parsedData = JSON.parse(data);
            t.equal(parsedData.err_code, '003');
            t.equal(parsedData.description, 'No URL to be shorten provided.');
        })
    })
});

test('Adiciona sem url e com CUSTOM_ALIAS', t => {
    t.plan(3);
    const gen = shortid.generate();
    http.get({
        hostname: host,
        port: port,
        method: 'PUT',
        path: `/create?CUSTOM_ALIAS=${gen}`,
    }, response => {
        response.on('data', data => {
            t.equal(response.statusCode, 400);
            const parsedData = JSON.parse(data);
            t.equal(parsedData.err_code, '003');
            t.equal(parsedData.description, 'No URL to be shorten provided.');
        })
    })
});

test('Adiciona com url malformada e com CUSTOM_ALIAS', t => {
    t.plan(3);
    const gen = shortid.generate();
    http.get({
        hostname: host,
        port: port,
        method: 'PUT',
        path: `/create?url=${urlInvalida}&CUSTOM_ALIAS=${gen}`,
    }, response => {
        response.on('data', data => {
            t.equal(response.statusCode, 400);
            const parsedData = JSON.parse(data);
            t.equal(parsedData.err_code, '004');
            t.equal(parsedData.description, 'Url is no valid');
        })
    })
});

test('Adiciona com url malformada e sem CUSTOM_ALIAS', t => {
    t.plan(3);
    http.get({
        hostname: host,
        port: port,
        method: 'PUT',
        path: `/create?url=${urlInvalida}`,
    }, response => {
        response.on('data', data => {
            t.equal(response.statusCode, 400);
            const parsedData = JSON.parse(data);
            t.equal(parsedData.err_code, '004');
            t.equal(parsedData.description, 'Url is no valid');
        })
    })
});

test('Adiciona duas vezes o mesmo CUSTOM_ALIAS', t => {
    t.plan(5);
    const gen = shortid.generate();
    http.get({
        hostname: host,
        port: port,
        method: 'PUT',
        path: `/create?url=${urlCorreta}&CUSTOM_ALIAS=${gen}`,
    }, response => {
        response.on('data', data => {
            t.equal(response.statusCode, 200);
            const parsedData = JSON.parse(data);
            t.equal(parsedData.alias, gen);

            http.get({
                hostname: host,
                port: port,
                method: 'PUT',
                path: `/create?url=${urlCorreta}&CUSTOM_ALIAS=${gen}`,
            }, response => {
                response.on('data', data => {
                    t.equal(response.statusCode, 400);
                    const parsedData = JSON.parse(data);
                    t.equal(parsedData.err_code, '001');
                    t.equal(parsedData.description, 'CUSTOM ALIAS ALREADY EXISTS.');
                })
            })
        })
    })
});

test('Requisita um redirecionamento inexistente', t => {
    t.plan(3);
    http.get({
        hostname: host,
        port: port,
        path: `/u/${shortIdInvalida}`,
    }, response2 => {
        response2.on('data', data => {
            t.equal(response2.statusCode, 404);
            const parsedData = JSON.parse(data);
            t.equal(parsedData.err_code, '002');
            t.equal(parsedData.description, 'SHORTENED URL NOT FOUND.');
        })
    })
});

//TODO: parametro do host e da porta necessitam ser mudados na chamada do npm