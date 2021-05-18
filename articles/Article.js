const Sequelize = require("sequelize")
const connection = require("../database/database")
const Category = require("../categories/Category")

// cria os artigos
const Article = connection.define('articles',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

// faz o relacionamento entre os bancos
Category.hasMany(Article); // uma categoria tem muitos artigos
Article.belongsTo(Category) // um artigo pertence a uma categoria

// cria o banco articles
//Article.sync({force: true});

module.exports = Article;