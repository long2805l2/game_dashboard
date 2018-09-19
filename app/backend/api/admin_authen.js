const fs   = require('fs');
const jwt   = require('jsonwebtoken');
const expressJwt = require('express-jwt');

class admin_authen
{
	constructor(publicKeyPath, privateKeyPath, keyAlgorithm)
	{
		this.RSA_PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');
		this.RSA_PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');
		this.expressVerify = expressJwt({
			secret: this.RSA_PUBLIC_KEY
		});
		this.algorithm = keyAlgorithm;
		this.expires = 8 * 60 * 60;
	}

	login (domain, password)
	{
		if (!domain || !password)
			return false;

		if (password != "root")
			return false;

		const jwtBearerToken = jwt.sign(
			{}
		,   this.RSA_PRIVATE_KEY
		,   {
				algorithm: this.algorithm,
				expiresIn: this.expires,
				subject: domain
			}
		);

		return {
			idToken: jwtBearerToken, 
			expiresIn: this.expires,
		};
	}

	verify (domain, token)
	{
		if (!domain || !token)
			return false;
		
		try
		{
			return jwt.verify(
				token
			,	this.RSA_PUBLIC_KEY
			,	{
					algorithm: [this.algorithm],
					expiresIn: 10,
					subject: domain
				}
			);
		}
		catch (err)
		{
			return false;
		}
	}
}

module.exports = admin_authen;