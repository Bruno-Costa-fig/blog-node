const express = require("express");
const router = express.Router();
const Category = require("./Category")
const slug = require("slugify");
const { default: slugify } = require("slugify");

// página para criar categorias
router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new")
})

// salva a categoria
router.post("/categories/save", (req, res)=>{
    var title = req.body.title;
    if(title != undefined || title != null){
        Category.create({
            title: title,
            slug: slug(title)
        }).then(()=>{
            res.redirect("/admin/categories")
        })
    }else{
        res.redirect("/admin/categories/new")
    }
})

// criando as tabelas de categorias
router.get("/admin/categories", (req, res)=>{

    Category.findAll().then(categories => {
        // passa a variável para o front
        res.render("admin/categories/index", {categories: categories})
    })
})

router.post("/categories/delete", (req, res)=> {
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){ // is number

            //apaga o registro
            Category.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            })

        } else {
           res.redirect("/admin/categories") 
        }
    } else { // is null
        res.redirect("/admin/categories") 
    }
})

router.get("/admin/categories/edit/:id", (req, res)=>{
    var id = req.params.id

    if(isNaN(id)){
        res.redirect("/admin/categories")
    }

    Category.findByPk(id).then(category =>{
        if(category != undefined){
            res.render("admin/categories/edit",{category:category})
        }else{
            res.redirect("/admin/categories")
        }
    }).catch(erro=>{
        res.redirect("/admin/categories")
    })
})

router.post("/categories/update",(req, res) =>{
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title:title, slug: slugify(title)},{
        where: {
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/categories")
    }).catch(erro =>{
        res.redirect("/admin/categories")
    })

})

module.exports = router;