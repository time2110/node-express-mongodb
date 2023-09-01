const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/key')
const User = require('../model/User')
const router = express.Router()

// 验证身份，中间件
const isAdmin = async (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(422).send('请登录')
    }
    // const token = req.headers.authorization.split(' ')[1]
    // const id = token.split('.')[0]
    // const userName = token.split('.')[1]

    // jwt-token
    const token = req.headers.authorization.split(' ').pop()
    let obj = {}
    try {
        obj = jwt.verify(token, secret)
    }catch (err) {
        return res.status(422).send('用户错误')
    }
    const {_id, userName} = obj
    const user = await User.findById(_id)
    // 判断 token正确性
    if(!user) {
        return res.status(422).send('用户错误')
    }
    if(userName !== user.userName) {
        return res.status(422).send('用户错误')
    }
    // 查看权限
    if(user.isAdmin == '0') {
        return res.status(422).send('用户没有权限')
    }else if(user.isAdmin == '1'){
        next()
    }
}

// 查询用户列表
router.get('/', isAdmin, async (req,res)=>{
    const list = await User.find()
    res.send(list)
})

// 注册
router.post('/register', async (req, res) => {
    const user = await User.findOne({
        userName: req.body.userName
    })
    if(user){
        return res.status(409).send('该用户已存在')
    }
    const newUser = await new User(req.body).save()
    res.send(newUser)
})

// 登录
router.post('/login', async (req, res) => {
    const user = await User.findOne({
        userName: req.body.userName
    })
    // 判断用户存在性
    if(!user) {
        return res.status(422).send('该用户不存在')
    }
    // 判断密码正确性
    // 解密
    let isPassword = await bcrypt.compareSync(req.body.password,user.password)
    if(!isPassword) {
        return res.status(422).send('密码错误')
    }
    const {_id, userName} = user
    const token = jwt.sign({_id, userName}, secret, {expiresIn: '24h'})
    return res.status(201).send(token)
})

// 验证
router.get('/verify', async (req, res) => {
    if(!req.headers.authorization) {
        return res.status(422).send('用户错误')
    }

    // const token = req.headers.authorization.split(' ')[1]
    // const id = token.split('.')[0]
    // const userName = token.split('.')[1]

    const token = req.headers.authorization.split(' ').pop()
    let obj = {}
    try {
        obj = jwt.verify(token, secret)
    }catch (err) {
        return res.status(422).send('用户错误')
    }
    const {_id, userName} = obj
    const user = await User.findById(_id)
    // 判断 token正确性
    if(!user) {
        return res.status(422).send('用户错误')
    }
    if(userName !== user.userName) {
        return res.status(422).send('用户错误')
    }
    // 查看权限
    if(user.isAdmin == '0') {
        return res.status(422).send('用户没有权限')
    }else if(user.isAdmin == '1'){
        res.send('Admin')
    }
})
module.exports = router