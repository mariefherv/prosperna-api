const bcrypt = require("bcrypt")
/* Mock Database */
users = [
    {
        email: "one@gmail.com",
        password: bcrypt.hashSync("onepw",10),
        products: [
            {
                product_id: 1,
                product_name: "Product One",
                product_description: "Description for product one",
                product_price: 15.25,
                product_tag: ["one", "solo"]
            },
            {
                product_id: 2,
                product_name: "Product Two",
                product_description: "Description for product two",
                product_price: 25.00,
                product_tag: ["two", "duo"]
            }
        ]
    },
    {
        email: "two@gmail.com",
        password: bcrypt.hashSync("twopw",10),
        products: [
            {
                product_id: 3,
                product_name: "Product Three",
                product_description: "Description for product three",
                product_price: 30.00,
                product_tag: ["three", "trio"]
            }
        ]
    }

]

// for updating user details
function update(email, data){

    for(let x in users) {
        if(users[x].email === email){
            // if both properties are to be updated
            if(data.email && data.password){
                hashedPw = bcrypt.hashSync(data.password,10)

                users[x].email = data.email
                users[x].password = hashedPw
            }

            // if only email is to be updated
            if(data.email) users[x].email = data.email

            // if only password is to be updated
            if(data.password){
                hashedPw = bcrypt.hashSync(data.password,10)
                users[x].password = hashedPw
            }
        }
        return users[x]
    };

    return undefined
}

// for updating product details
function updateProduct(email, data, id){

    user = users.find(user => user.email === email)
    
    product = user.products.find(product => product.product_id === id)

    details = {
        product_name: data.product_name,
        product_description: data.product_description,
        product_price: data.product_price,
        product_tag: data.product_tag
    }

    // if product not found for the user, return undefined
    if(product === undefined) return undefined

    for(let property in details) {
        if(details[property] !== undefined){
            product[property] = details[property]
        }
    }

    return product
}

// for deleting a product
function deleteProduct(email, id){

    user = users.find(user => user.email === email)
    
    orig_length = user.products.length

    index = user.products.findIndex(product => product.product_id === id)

    // if product not found for the user, return undefined
    if(index === -1) return undefined

    user.products.splice(index,1)

    // if product is deleted return true
    if(orig_length > user.products.length) return true

    return undefined
}

module.exports = { users: users, update: update, updateProduct: updateProduct, deleteProduct: deleteProduct }
