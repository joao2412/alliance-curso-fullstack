module.exports = function(app, pool) {
    // Retorna todos os usuarios
    app.get('/usuarios/', async(req, res) => {
        const result = await pool.query("SELECT codigo, nome, login, email FROM usuarios");
        res.status(200).send(result.rows);
    })

    // Retorna o produto com o codigo informado
    app.get('/usuarios/:codigo', async(req, res) => {
        const result = await pool.query("SELECT codigo, nome, login, email FROM usuarios WHERE codigo = $1", [req.params.codigo]);

        if (result.rowCount == 0) {
            res.statusCode = 404
            res.send("")
        } else
            res.send(result.rows[0]);
    })

    app.delete('/usuarios/:codigo', async(req, res) => {
        var result = await pool.query("DELETE FROM usuarios WHERE codigo = $1", [req.params.codigo]);

        if (result.rowCount == 0) {
            res.statusCode = 404
            res.send("NOK");
        } else {
            res.send("OK");
        }
    })


    app.put('/usuarios/:codigo', async(req, res) => {
        const resource = await pool.query("SELECT codigo, nome, login, email FROM usuarios WHERE codigo = $1", [req.params.codigo]);
        var newObj = req.body;
        
        if (resource.rowCount == 0) {
            res.statusCode = 404
            res.send("NOK");
        } else {
            var elementoAtual = resource.rows[0];

            
            if (elementoAtual.codigo != newObj.codigo && newObj.codigo) {
                res.status(400).send("Change codigo is not allowed")
            }

            
            var someOneWithSameLogin = await pool.query("SELECT codigo FROM usuarios WHERE login=$1 and codigo<>$2", [newObj.login, req.params.codigo]);
            if (someOneWithSameLogin.rowCount > 0) {
                res.status(409).send("Login already used by other user")
            }

            const updated = await pool.query("UPDATE usuarios SET nome = $1, login = $2, email =$3 WHERE codigo = $4 RETURNING *", [newObj.nome, newObj.login, newObj.email, req.params.codigo]);
            res.send(updated.rows[0]);
        }
    })

    app.post('/usuarios', async(req, res) => {
        var newObj = req.body;
        
        const sameCodigo = await pool.query("SELECT login FROM usuarios WHERE login = $1", [newObj.login]);
        if (sameCodigo.rowCount > 0) {
           
            res.statusCode = 409;
            res.send("Login already registered");
        } else {
            
            const inserted = await pool.query("INSERT INTO usuarios (nome, login, email) VALUES ($1, $2, $3) RETURNING *", [newObj.nome, newObj.login, newObj.email]);
            
            res.status(201).send(inserted.rows[0]);
        }
    })
}