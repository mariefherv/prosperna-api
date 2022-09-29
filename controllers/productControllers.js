const e = require("express");
const { users, updateProduct, deleteProduct } = require("../mock.js")

// view list of products
module.exports.viewAll = (req, res) => {

    productsArr = []

    users.forEach(user => {
        productsArr.push(...user.products)
    });

    res.send(productsArr)
}

// view individual product
module.exports.viewProduct = (req, res) => {

    id = Number(req.params.product_id)
    var foundProduct = undefined

    users.forEach(user => {
        user.products.forEach(product => {
            if(id === product.product_id) foundProduct = product
        })
    })

    res.send(foundProduct)
}

// update product details
module.exports.updateProductDetails = (req, res) => {
    id = Number(req.params.product_id)

    updated = updateProduct(req.user.email, req.body, id);

    res.send(updated)
}

// delete product
module.exports.delete = (req, res) => {
    id = Number(req.params.product_id)

    deleted = deleteProduct(req.user.email, id);

    if(deleted){
        res.status(200).send({
            'success': 'Successfully deleted.'
        })
    } else {
        res.status(403).send({
            'error': "Forbidden. This is because it's either you don't own this product or it doesn't exist."
        })
    }
}