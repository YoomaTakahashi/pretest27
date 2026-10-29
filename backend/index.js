require('dotenv').config({path:'.env'})
const express = require('express')
const fileUp = require('express-fileupload')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(fileUp())
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))

const auth = require('./routes/auth')
app.use('/api/auth',auth)

const profile = require('./routes/profile')
app.use('/api/profile',profile)

const dash = require('./routes/dash')
app.use('/api/dash',dash)

const edit_eva = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit_eva)

const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva)

const show_eva = require('./routes/Commit/show_eva')
app.use('/api/Commit/show_eva',show_eva)

const save_score = require('./routes/Commit/save_score')
app.use('/api/Commit/save_score',save_score)

const score_member = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_member)

const score_commit = require('./routes/Eva/score_commit')
app.use('/api/Eva/score_commit',score_commit)

app.use((req,res)=> res.status(404).json({message:'Route Not Found'}))
app.listen(3001,()=>{
    console.log('Server Running on port 3001')
})
