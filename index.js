/*
    ## Projeto de criação de blog CRUD com node js;

    O projeto está organizado em um padrão semelhante ao MVC;

    Cada funcionalidade está separada com o seu Repository e controller

    O projeto vai ser gerenciado por um admin, onde vamos fazer o login

    Iniciado em 19.02.21 por Bruno Costa
    
*/
const express = require("express")
const app = express()
const session = require("express-session")
const connection = require("./database/database")

// chama os controllers
const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./user/UsersController")

// chama os DB
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User")

// view engine
app.set('view engine', 'ejs');

// sessions
//app.use(session({
    /* aqui nós estamos cadastrando as sessões.
        - O Secret é tipo p salt do bcrypt.
        
        - Já o cookie é so uma porta necessária para a sessão
        rodar no navegador.

        - o maxAge é o tempo que a sessão expira e é medido em
        milisegundos.

    */
    //secret: "azulamarelo", cookie: {maxAge: 30000}
//}))

// body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// static
app.use(express.static('public'))

// database
connection
.authenticate()
.then(()=>{
    console.log("Conetado com sucesso")
}).catch((error)=>{
    console.log(error)
})

// página principal
app.get("/", (req, res) => {
    Article.findAll({
        // organizar na forma decrescente
        order: [
            ["id","DESC"]
        ],
        limit: 4
    }).then(articles =>{
        /* pegamos os artigos. Agora vamos passar também as categorias
        para criar o menu de categorias */
        Category.findAll().then(categories => {
            res.render("index", {articles:articles, categories: categories})
        })
    })
})

app.get("/:slug", (req, res) =>{
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            /* pegamos os artigos. Agora vamos passar também as categorias
            para criar o menu de categorias */
            Category.findAll().then(categories => {
                res.render("article", {article:article, categories: categories})
            })
        } else {
            res.redirect("/")
        }
    }).catch( err => {
        res.redirect("/")
    })
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        // vamos fazer um join com os artigos
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles, categories: categories})
            })
        } else {
            res.redirect("/")
        }
    }).catch( err =>{
        res.redirect("/")
    })
})

// liga os controlers
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

// define a porta
app.listen(8080, ()=>{
    console.log("O servidor está rodando!")
})