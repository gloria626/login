var mongoose = require('mongoose');
var studentSchema = require('../schemas/student.js'); //引入'../schemas/student.js'导出的模式模块

// 编译生成student模型
var student = mongoose.model('student', studentSchema);

// 将student模型[构造函数]导出
module.exports = student;