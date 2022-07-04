const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError } = require('../errors')



const register = async(req,res)=>{
   
    const user = await User.create({...req.body})
   const token = user.createJWT()
    res.status(StatusCodes.CREATED).send({user:{name:user.name}, token})
    
}

const login = async(req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('please provide email and password')
    }
    const user = await User.findOne({email})
    
    if(!user){
        throw new UnauthenticatedError('please provide valid email')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('please provide valid pass')
    }
    
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name}, token})

}

module.exports = {
    register,login
}

