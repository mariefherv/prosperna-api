const chai = require("chai");
const { assert } = require("chai");
const bcrypt = require("bcrypt")

const http = require("chai-http");
chai.use(http);

var token;

describe("Test Suite for Users API", () => {

    it("View all users", (done) => {
        chai.request("http://localhost:4000")
        .get("/users/viewAll")
        .end((err,res) => {
            console.log(res.body)
            assert.isNotEmpty(res.body);
            done();
        })
    })

    // View user details given email address
    it("View User Details of given email address", (done) => {
        chai.request("http://localhost:4000")
        .post('/users/viewUser')
        .type('json')
        .send({email: "two@gmail.com"})
        .end((err, res) => {
            assert.equal(res.body.email, "two@gmail.com")
            done();
        })
    })
    
    it("Login User with Correct Credentials and Generate access token", (done) => {
        chai.request("http://localhost:4000")
        .post('/users/login')
		.type('json')
		.send({
			email: "one@gmail.com",
			password: "onepw",
		})
		.end((err, res) => {
            token = res.body.accessToken
			assert.isDefined(res.body.accessToken)
			done();
		})
	    })

        it("Login User with Wrong Credentials", (done) => {
            chai.request("http://localhost:4000")
            .post('/users/login')
            .type('json')
            .send({
                email: "one@gmail.com",
                password: "wrong",
            })
            .end((err, res) => {
                assert.isUndefined(res.body.accessToken)
                done();
            })
        })

    // View user details of logged in user
    it("View User Details of Logged in User", (done) => {
        chai.request("http://localhost:4000")
        .get('/users/viewUser')
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
            console.log(res.body.email)
            assert.isDefined(res.body.email)
            done();
        })
    })

    // Updating logged in user's email
    it("Update User Details - Email (only logged in", (done) => {
        chai.request("http://localhost:4000")
        .put('/users/update')
        .type('json')
        .set("Authorization", "Bearer " + token)
		.send({
			email: "oneedit@gmail.com",
		})
        .end((err, res) => {
            assert.equal(res.body.email, "oneedit@gmail.com")
            done();
        })
    })

    // Logging in with updated email
    it("Login again with new email", (done) => {
        chai.request("http://localhost:4000")
        .post('/users/login')
		.type('json')
		.send({
			email: "oneedit@gmail.com",
			password: "onepw",
		})
		.end((err, res) => {
            token = res.body.accessToken
			assert.isDefined(res.body.accessToken)
			done();
		})
	})

    // Updating logged in user's password
    it("Update User Details - Password (only logged in)", (done) => {
        chai.request("http://localhost:4000")
        .put('/users/update')
        .type('json')
        .set("Authorization", "Bearer " + token)
		.send({
			password: "oneedit"
		})
        .end((err, res) => {
            assert.isTrue(bcrypt.compareSync("oneedit", res.body.password))
            done();
        })
    })

    // Logging in again with new password
    it("Login again with new password", (done) => {
        chai.request("http://localhost:4000")
        .post('/users/login')
		.type('json')
		.send({
			email: "oneedit@gmail.com",
			password: "oneedit",
		})
		.end((err, res) => {
            token = res.body.accessToken
			assert.isDefined(res.body.accessToken)
			done();
		})
	})

    // Updating logged in user's email and password
    it("Update User Details - Email and Password (only logged in)", (done) => {
        chai.request("http://localhost:4000")
        .put('/users/update')
        .type('json')
        .set("Authorization", "Bearer " + token)
		.send({
            email: "onefinal@gmail.com",
			password: "onefinalpw"
		})
        .end((err, res) => {
            assert.isTrue( (res.body.email === "onefinal@gmail.com") && bcrypt.compareSync("onefinalpw", res.body.password))
            done();
        })
    })

    // Logging in with updated email and password
    it("Login again with new email and password", (done) => {
        chai.request("http://localhost:4000")
        .post('/users/login')
		.type('json')
		.send({
			email: "onefinal@gmail.com",
			password: "onefinalpw",
		})
		.end((err, res) => {
            token = res.body.accessToken
			assert.isDefined(res.body.accessToken)
			done();
		})
	})

    // Viewing the updated details of logged in user
    it("View NEW User Details of Logged in User", (done) => {
        chai.request("http://localhost:4000")
        .get('/users/viewUser')
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
            console.log(res.body.email)
            assert.isTrue((res.body.email === "onefinal@gmail.com") && bcrypt.compareSync("onefinalpw", res.body.password))
            done();
        })
    })

})

// Test Suite for Products
describe("Test Suite for Products API", () => {

    // View all products
    it("View all products", (done) => {
        chai.request("http://localhost:4000")
        .get("/products")
        .end((err,res) => {
            console.log(res.body)
            assert.isNotEmpty(res.body);
            done();
        })
    })

    // View individual product
    it("View Product One", (done) => {
        chai.request("http://localhost:4000")
        .get("/products/view/1")
        .end((err,res) => {
            console.log(res.body)
            assert.equal(res.body.product_name, "Product One");
            done();
        })
    })

    // Viewing non-existing product must be undefined
    it("View Product Four (non-existent)", (done) => {
        chai.request("http://localhost:4000")
        .get("/products/view/4")
        .end((err,res) => {
            assert.isEmpty(res.body);
            done();
        })
    })

    // Updating products of a logged in user
    it("Update Product Details of Product One - product_name (only logged in)", (done) => {
        chai.request("http://localhost:4000")
        .put('/products/update/1')
        .type('json')
        .set("Authorization", "Bearer " + token)
		.send({
            product_name: "Product One Edit"
		})
        .end((err, res) => {
            console.log(res.body)
            assert.equal(res.body.product_name, "Product One Edit")
            done();
        })
    })
    
    // Updating products of a logged in user
    it("Update Product Details of Product One - product_description (only logged in)", (done) => {
        chai.request("http://localhost:4000")
        .put('/products/update/1')
        .type('json')
        .set("Authorization", "Bearer " + token)
        .send({
            product_description: "Product Description Has Been Edited"
        })
        .end((err, res) => {
            console.log(res.body)
            assert.equal(res.body.product_description, "Product Description Has Been Edited")
            done();
        })
    })

    // Updating products of a logged in user
    it("Update Product Details of Product One - product_price (only logged in)", (done) => {
        chai.request("http://localhost:4000")
        .put('/products/update/1')
        .type('json')
        .set("Authorization", "Bearer " + token)
        .send({
            product_price: 10.99
        })
        .end((err, res) => {
            console.log(res.body)
            assert.equal(res.body.product_price, 10.99)
            done();
        })
    })

    // Updating products of a logged in user
    it("Update Product Details of Product One - product_tag (only logged in)", (done) => {
        chai.request("http://localhost:4000")
        .put('/products/update/1')
        .type('json')
        .set("Authorization", "Bearer " + token)
        .send({
            product_tag: ["one", "solo", "new"]
        })
        .end((err, res) => {
            console.log(res.body)
            assert.include(res.body.product_tag, "new")
            done();
        })
    })

    // Updating products of a logged in user
    it("Update Product Details of Product One - all properties (only logged in)", (done) => {
        chai.request("http://localhost:4000")
        .put('/products/update/1')
        .type('json')
        .set("Authorization", "Bearer " + token)
        .send({
            product_name: "Product One Final",
            product_description: "Final description",
            product_price: 12.99,
            product_tag: ["one", "solo", "new", "final"]
        })
        .end((err, res) => {
            console.log(res.body)
            assert.equal(res.body.product_name, "Product One Final")
            assert.equal(res.body.product_description, "Final description")
            assert.equal(res.body.product_price, 12.99)
            assert.include(res.body.product_tag, "final")
            done();
        })
    })

    // Updating products of a logged in user
    // This should return undefined
     it("Update product details of products that don't belong to logged in user (returns undefined)", (done) => {
        chai.request("http://localhost:4000")
        .put('/products/update/3')
        .type('json')
        .set("Authorization", "Bearer " + token)
        .send({
            product_name: "Must Be Error",
        })
        .end((err, res) => {
            assert.isEmpty(res.body)
            done();
        })
    })

    // Trying to update products if not logged in (401)
    it("Update Product Details (Not Logged In) - 401", (done) => {
        chai.request("http://localhost:4000")
        .put('/products/update/1')
        .type('json')
        .send({
            product_tag: ["not logged in"]
        })
        .end((err, res) => {
            assert.equal(res.status, 401)
            done();
        })
    })

    // Deleting a product
    it("Delete Product Two", (done) => {
        chai.request("http://localhost:4000")
        .delete('/products/delete/2')
        .type('json')
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
            assert.equal(res.status, 200)
            done();
        })
    })

    // Deleting a non-existent product (must return 403)
    it("Delete Non-existent product (403)", (done) => {
        chai.request("http://localhost:4000")
        .delete('/products/delete/4')
        .type('json')
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
            assert.equal(res.status, 403)
            done();
        })
    })

    // Trying to delete products if not logged in (401)
    it("Delete Product (Not Logged In) - 401", (done) => {
        chai.request("http://localhost:4000")
        .delete('/products/delete/1')
        .type('json')
        .end((err, res) => {
            assert.equal(res.status, 401)
            done();
        })
    })

    // Viewing all products after deleting
    it("View all products after deletion", (done) => {
        chai.request("http://localhost:4000")
        .get("/products")
        .end((err,res) => {
            console.log(res.body)
            assert.isNotEmpty(res.body);
            done();
        })
    })


})
