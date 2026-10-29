const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

exports.verifyToken = (req,res,next)=>{
    const authHeader = req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message:'Invalid Token'})
    }
    const token = authHeader.split(' ')[1]
    try {
        req.user = jwt.verify(token,JWT_SECRET)
        next()
    } catch (error) {
        console.error('Invalid token',error)
        res.status(403).json({message:'Invalid Token'})
    }
}

exports.requireRole = (role) =>(req,res,next)=>{
    if(req.user && req.user.role === role){
        return next()
    }
    res.status(403).json({message:'Invalid Role'})
}
