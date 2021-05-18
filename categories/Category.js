const Sequelize = require("sequelize")
const connection = require("../database/database")

// define o banco de dados
const Category = connection.define('categories',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }

})

// cria o banco de dados;
//Category.sync({force:true});

module.exports = Category;