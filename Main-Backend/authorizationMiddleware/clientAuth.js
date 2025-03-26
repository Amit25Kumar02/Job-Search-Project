const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token after 'Bearer '
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user data to request object
        console.log(req.user)
        next(); // Proceed to next middleware/controller
    } catch (error) {
        console.log(error)  
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = verifyToken;
