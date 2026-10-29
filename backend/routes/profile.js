const express = require('express')
const db = require('../db')
const router = express.Router()
const {verifyToken} = require('../middleware/authmiddleware')

router.get('/',verifyToken,async (req,res) => {
    try {
        const [rows] = await db.query('SELECT id_member, fname, lname, username, email, role FROM tb_member WHERE id_member = ?', [req.user.id_member])
        if (!rows.length) return res.status(404).json({message:'User Not Found'})
        res.json(rows[0])
    } catch (error) {
        console.error('Error Get user',error)
        res.status(500).json({message:'Error Get user'})
    }
})

module.exports = router
