const {PrismaClient} = require('@prisma/client')
const { hash, compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const db = new PrismaClient()

const register = async (req,res)=>{
    try {
        const existUser = await db.user.findUnique({
            where:{email:req.body.email}
        })
        if (existUser){
            return res.status(400).json({message:"Un utilisateur existe déjà avec cet email."})
        }
        const hashPass = await hash(req.body.password,+process.env.POWER_HASH)
        const newUser = await db.user.create({
            data:{...req.body,password:hashPass},
            select:{
                id: true,
                farstName: true,
                lastName: true,
                email: true,
                isOwner: true,
                createdAt: true,
                updatedAt: true,
                center: true,
            }
        })
        res.status(201).json({message:"Utilisateur créé avec succès",user:newUser})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}

const login = async (req,res)=>{
    try {
        const existUser = await db.user.findUnique({
            where:{
                email:req.body.email
            },
            include:{
                center:true
            }
        })
        if(!existUser){
  return res.status(404).json({message:"Cet utilisateur n'existe pas."})
        }
        const isPassword = await compare(req.body.password,existUser.password)
        if(!isPassword){
            return res.status(400).json({message:"Mot de passe incorrect."})
        }
        const token = sign({id:existUser.id,isOwner:existUser.isOwner},process.env.SUCRET_KEY)
        res.status(200).json({
            message:"connection bien etablier",
            token,
            user:{
                id: existUser.id,
                farstName: existUser.farstName,
                lastName: existUser.lastName,
                email: existUser.email,
                isOwner: existUser.isOwner,
                createdAt: existUser.createdAt,
                updatedAt: existUser.updatedAt,
                center: existUser.center,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}

module.exports = {register,login}