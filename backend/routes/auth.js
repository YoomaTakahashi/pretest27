const express = require('express')
const path= require('path')
const uploadDir = path.join(__dirname,'../uploads/pic_user')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const bc= require('bcrypt')
const db = require('../db')
const router = express.Router()

router.get('/', async (req,res) => {
    try {
        const header = req.get('Authorization') || ''
        if (!header.startsWith('Bearer ')) return res.status(401).json({message:'Invalid Token'})
        const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
        const [rows] = await db.query('SELECT id_member, fname, lname, username, email, role FROM tb_member WHERE id_member = ?', [payload.id_member])
        if (!rows.length) return res.status(404).json({message:'User Not Found'})
        res.json(rows[0])
    } catch (error) {
        console.error('Error Get user',error)
        res.status(401).json({message:'Invalid Token'})
    }
})

router.post('/regis',async(req,res)=>{
    try {
        const form = JSON.parse(req.body.form)
        const pic_user = req.files?.pic_user
        let filename = null
        if(pic_user){
            filename = Date.now() + path.extname(pic_user.name)
            await pic_user.mv(path.join(__dirname,'../uploads/pic_user',filename))
        }
        const hash = await bc.hash(form.password,10)
        const [rows] = await db.query(`insert into tb_member(fname,lname,email,username,password,role,pic_user) values(?,?,?,?,?,?,?)`,[form.fname,form.lname,form.email,form.username,hash,form.role,filename])
        res.json(rows,{message:"regis Success"})
    } catch (error) {
        console.error('Error regis',error)
        res.status(500).json({message:'Error regis'})
    }


})

router.post('/login',async(req,res)=>{

    try {
        const {username,password,role} = req.body
        
        const [rows] = await db.query(`select * from tb_member where username=? and role=?`,[username,role])
        const m = rows[0]

        if(!m || !password || !(await bc.compare(password,m.password))){
            return res.status(400).json({message:"รหัสผ่านไม่ถูกต้อง"})
        }
        const token = jwt.sign(
            {id_member:m.id_member,username:m.username,role:m.role},JWT_SECRET,{expiresIn:'24h'}
        )
        res.json({token,role:m.role},{message:"login Success"})
    } catch (error) {
        console.error('Error login',error)
        res.status(500).json({message:'Error login'})
    }


})

module.exports = router
