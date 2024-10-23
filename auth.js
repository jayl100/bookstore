const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const ensureAuthorization = (req, res) => {

    try {
        let receivedJWT = req.headers['authorization'];
        console.log("receivedJWT : ", receivedJWT);

        if (receivedJWT) {
            let decodedJWT = jwt.verify(receivedJWT, process.env.JWT_SECRET);
            console.log(decodedJWT);
            return decodedJWT;
        } else {
            throw new ReferenceError("jwt must be an invalid token");
        }
    } catch (err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

module.exports = ensureAuthorization;