const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; 
    //  console.log(token)
    try {
        const decoded =  jwt.verify(token,process.env.JWT_SECRET); // Verify token
        //  console.log( "14 line",decoded)
        req.user = decoded; // Attach user data to request object
        // console.log("user", req.user)
        next(); // Proceed to next middleware/controller
    } catch (error) {
        console.log( "error",error)  
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = verifyToken;