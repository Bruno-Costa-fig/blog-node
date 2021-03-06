const express = require("express")
const router = express.Router();
const User = require("./User")
const bcrypt = require("bcryptjs")

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users})
    })
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

router.post("/users/create", (req, res) => {
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if(user == undefined){
             // gerar hash da senha
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)

            User.create({
                name: name,
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch(() => {
                res.redirect("/admin/users/create")
            })

        } else {
            res.redirect("/admin/users/create")
        }
    })

})

router.get("/login", (req, res) => {
    res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if(user){
            // validação da senha
            var correct = bcrypt.compareSync(password, user.password)

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.json(req.session.user)
            } else {
                res.redirect("/admin/login")
            }

        } else {
            res.redirect("/admin/login")
        }
    })
})

module.exports = router;