const mongoose = require('mongoose')
const mongoUrl = 'mongodb://localhost:27017/login'
module.exports = app => {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('成功连接到数据库');
            // 在这里可以进行后续操作
        })
        .catch((error) => {
            console.error('连接数据库时发生错误:', error);
        });
}
