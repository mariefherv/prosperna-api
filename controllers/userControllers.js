const { users, update } = require("../mock.js")
const auth = require("../auth");
const bcrypt = require("bcrypt")

// view list of users
module.exports.viewAll = (req, res) => {

    usersArr = []

    users.forEach(user => {
        usersArr.push({email: user.email})
    });

    res.send(usersArr)
}

// view individual user details
module.exports.viewUser = (req,res) => {

    let foundUser = users.find((user) => {
        // if someone is logged in (GET method with authorization)
        if(req.user !== undefined) return user.email === req.user.email
        // using POST method (no authorization)
        return user.email === req.body.email
    })
    
    if(foundUser){
        return res.send(foundUser)
    } else {
        // return undefined if user wasn't found
        res.send(undefined)
    }
    }

// login
module.exports.login = (req, res) => {

    let foundUser = users.find((user) => {
        return user.email === req.body.email && bcrypt.compareSync(req.body.password, user.password)
    })

    if(foundUser){
        const token = auth.createAccessToken(foundUser)
        return res.send({accessToken: token})
    } else {
        // return null/undefined if invalid credentials
        res.send({accessToken: undefined})
    }
}

// update user details
module.exports.updateUser = (req, res) => {
    updated = update(req.user.email, req.body);

    res.send(updated)
}