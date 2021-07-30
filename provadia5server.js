const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()

app.use(cors())
app.use(express.json());

const port = 3000

const pool = new Pool({
    connectionString: "postgres://postgres:24120200@postgres:2412/loja"
});

pool.on('connect', () => {
    console.log("Base de dados conectada com sucesso")
})


const produtosApi = require('./api/produtos');
produtosApi(app, pool); //registra as rotas

const usuariosApi = require('./usuarios');
usuariosApi(app, pool); //registra as rotas

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})