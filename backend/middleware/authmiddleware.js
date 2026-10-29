const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

exports.verifyToken = (req,res,next)=>{
    const authHeader = req.header ("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({message:'Invalid Token On or more'})
    }
    const token = authHeader.split(" ")[1]
    try {
        req.user = jwt.verify(token,JWT_SECRET)
        next()
    } catch (error) {
        console.error('Invalid Token On or more',error)
        res.status(403).json({message:'Invalid Token On or more'})
    }
}
exports.requireRole = (role) =>(req,res,next)=>{
    try {
        if(req.user && req.user.role === role){
            return next()
        }
        res.status(403).json({message:'Invalid Role On or more'})
    } catch (error) {
        console.error('Invalid Role On or more',error)
        res.status(403).json({message:'Invalid Role On or more'})
    }
}