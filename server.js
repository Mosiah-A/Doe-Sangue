// configurando o servidor
const express = require("express")
const server = express()

// configurar o servidos para apresentar arquivos estaticos
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({ extended: true}))

// configurar a conexao com o banco de dado
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'adms7777',
    host: 'localhost',
    port: 5432,
    database: 'Doe'
})

// configurando a template  engine
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
    express: server,
    noCache: true, //boolean ou booleano aceita 2 valores, verdadeiro ou falso.
})


// configurar a apresentação da página
server.get("/", function(req, res) {
    
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send('erro no banco de dados')

        const donors = result.rows
        return res.render("index.html",{ donors })
    })

})

server.post("/", function(req, res){
   //pegar dados do formulario.
   const name = req.body.name 
   const email = req.body.email 
   const blood = req.body.blood 

   //se o name igual a vazio
   //se o email igual a vazio
   //se o blood igual a vazio
   if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatorio")
   }

    //colocar valores dentro do banco de dados.
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES($1, $2, $3)`

    const values = [name, email, blood]
    
    db.query(query, values, function(err) {
       // fluxo de erro
       if (err) {
        console.log(err)
          return res.send("erro no banco de dados.")
      }

        // fluxo ideal
        return res.redirect("/")
    })

})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("iniciei o servido")
})