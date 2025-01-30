const jwt = require('jsonwebtoken');

async function validateToken(req, res, next) {
    try {
        if (req.url.split('?')[0] != '/webhook') {
            const auth_header = req.headers['authorization'];
        
            const token = auth_header.split(' ')[1];
            if (token == null) return res.status(400).json({ message: 'Token not there', isSuccess: false });
    
            const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
            if (decodedToken == null) return res.status(400).json({ message: 'Token not valid', isSuccess: false });
    
            req._id = decodedToken.user_id;
        }

        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message, isSuccess: false });
    }
}

module.exports = validateToken;