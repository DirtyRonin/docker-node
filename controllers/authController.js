const bcrypt = require('bcryptjs')

const User = require('../models/userModel')


exports.signUp = async (req, res) => {

    const { username, password } = req.body
    
    try {
        const hashpassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({ username, password: hashpassword })
        
        assignToRedis(newUser,req)

        res.status(200).json({
            status: 'success',
            data: { user: newUser }
        })

    } catch (error) {
        res.status(400).json({
            status: 'fail',
        })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body
    try {

        const user = await User.findOne({ username })

        if (!user)
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })

        const isCorrect = await bcrypt.compare(password, user.password)

        if (!isCorrect) {
            return res.status(400).json({
                status: 'fail',
                message: 'Incorrect username or password'
            })
        }

        assignToRedis(user,req)
        // sess.username = username
        // sess.password = password

        return res.status(200).json({
            status: 'success'
        })

    } catch (error) {
        res.status(400).json({
            status: 'fail',
        })
    }
}

assignToRedis = (user,req) => {
    req.session.user = user;
}


