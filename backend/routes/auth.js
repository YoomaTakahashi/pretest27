const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
        const hash = await bcrypt.hash(form.password,10)
        const [rows] = await db.query('INSERT INTO tb_member(fname,lname,email,username,password,role,pic_user) VALUES(?,?,?,?,?,?,?)',[form.fname,form.lname,form.email,form.username,hash,form.role,filename])
        res.json(rows)
    } catch (error) {
        console.error('Error regis',error)
        res.status(500).json({message:'Error regis'})
    }
})

router.post('/login',async(req,res)=>{
    try {
        const {username,password,role} = req.body
        const [rows] = await db.query('SELECT * FROM tb_member WHERE username = ? AND role = ? LIMIT 1',[String(username || '').trim(),String(role || '').trim()])
        const member = rows[0]
        if(!member || !password || !(await bcrypt.compare(password,member.password))){
            return res.status(400).json({message:'ชื่อผู้ใช้ ประเภทสมาชิก หรือรหัสผ่านไม่ถูกต้อง'})
        }
        const token = jwt.sign({id_member:member.id_member,username:member.username,role:member.role},process.env.JWT_SECRET,{expiresIn:'24h'})
        res.json({token,role:member.role,username:member.username})
    } catch (error) {
        console.error('Error login',error)
        res.status(500).json({message:'Error login'})
    }
})

module.exports = router
