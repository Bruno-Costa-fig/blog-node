const express = require("express");
const router = express.Router();
const Category = require("../categories/Category")
const Article = require("./Article")
const Slugify = require("slugify");

router.get("/admin/articles", (req, res)=>{
    Article.findAll({
        // vai importar o model category para a view
        include: [{model: Category}]
    }).then(articles =>{
        // passa a variável para o front
        res.render("admin/articles/index", {articles: articles})
    })
})

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new-article", {categories: categories})
    })
})

router.post("/articles/save", (req, res)=> {
    // title do article
    var title = req.body.title
    // body do article gerado pelo tinyMCE
    var body = req.body.body
    // id da categoria escolhida que foi colocado no name do select
    var category = req.body.category


    Article.create({
        title: title,
        slug: Slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles")
    })
})

router.post("/articles/delete", (req, res) => {
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/articles")
            })
        } else {
            res.redirect("/admin/articles")
        }
    } else {
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id

    if(isNaN(id)){
        res.redirect("/admin/articles")
    }

    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {article: article, categories: categories})
            })
            
        } else {
            res.redirect("/admin/articles")
        }
    }).catch( err => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/update", (req, res) => {
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.update({title: title, slug: Slugify(title), body: body, categoryId: category},{
        where: {
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles")
    }).catch(erro =>{
        res.redirect("/admin/articles")
    })
})

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num
    var offset = 0
    var limit = 4

    // lógica da paginação
    if(isNaN(page || page == 1)){
        offset = 0 
    } else {
        offset = (parseInt(page) - 1) * limit;
    }

    //sistema de paginação
    Article.findAndCountAll({
        order: [
            ["id","DESC"]
        ],
        limit: limit,
        offset: offset
    }).then(articles => {

        var next;
        if(offset + 4 >= articles.count){
            next = false
        } else {
            next = true
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        })
        
    })
})

module.exports = router;