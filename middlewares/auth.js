import jwt from 'jsonwebtoken';

const UserAuth = async(req, res, next)=>{
    // console.log("Authorization:", req.headers["authorization"]);
    try {
        let bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader != undefined){
            const token = bearerHeader.split(' ')[1];
            const user = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(user);
            req.token = user
            return next()
        }else{
            res.status(401).json(["NA", {message: 'Token Not Set'}]);
        }
    } catch (error) {
        res.status(403).json(["Invalid",  {message: 'Invalid or Expired Token'}]);
        //  res.status(403).json(error.message);
    }
}

export default UserAuth; 