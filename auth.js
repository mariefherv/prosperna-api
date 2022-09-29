const jwt = require("jsonwebtoken");

const secret = "prosperna";

module.exports.createAccessToken = (userDetails) => {
	const data = {
		email: userDetails.email,
		isAdmin: userDetails.isAdmin,
	}
	//jwt.sign() will create a JWT using our data object, with our secret.
	return jwt.sign(data,secret,{});
}

// Verify if authenticated user
module.exports.verify = (req,res,next) => {

	let token = req.headers.authorization
	if(typeof token === "undefined"){
		return res.status(401).send({
            'error': "No Token"
        });
	} else {
		token = token.slice(7);
		jwt.verify(token,secret,function(err,decodedToken){
			if(err){
				return res.send({
					auth: "No such user exists! Please try again.",
					message: err.message
				})
			} else {
				req.user = decodedToken;
				next();
			}
		})
	}

}

