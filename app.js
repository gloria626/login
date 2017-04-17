var express = require('express');  // 加载express模块
var app = express(); // 启动Web服务器

var port = process.env.PORT || 3000; // 设置端口号：3000
app.listen(port); // 监听 port[3000]端口
console.log('studentsinfo start on port' + port);

var path = require('path');
// 引入path模块的作用：因为页面样式的路径放在了bower_components，告诉express，请求页面里所过来的请求中，如果有请求样式或脚本，都让他们去bower_components中去查找

var mongoose = require('mongoose'); // 加载mongoose模块
mongoose.connect('mongodb://localhost:27017/studentsinfo'); // 连接mongodb本地数据库studentsinfo
console.log('MongoDB connection success!');
/*  mongoose 简要知识点补充
* mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]和Document[文档]对象，用起来更为方便。
* Schema对象定义文档的结构（类似表结构），可以定义字段和类型、唯一性、索引和验证。
* Model对象表示集合中的所有文档。
* Document对象作为集合中的单个文档的表示。
* mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合。
* */

//app.locals.moment = require('moment'); // 载入moment模块，格式化日期

var serveStatic = require('serve-static');  // 静态文件处理
//app.use(serveStatic('public')); // 路径：public

var bodyParser = require('body-parser');
// 因为后台录入页有提交表单的步骤，故加载此模块方法（bodyParser模块来做文件解析），将表单里的数据进行格式化
app.use(bodyParser.urlencoded({extended: true}));

var _underscore = require('underscore'); // _.extend用新对象里的字段替换老的字段

app.set('views', './views/pages');     // 设置视图默认的文件路径
app.set('view engine', 'jade');  // 设置视图引擎：jade

//app.use(express.static(path.join(__dirname, 'public')));

var student = require('./models/student.js'); // 载入mongoose编译后的模型student

// 编写主要页面路由
// index page 首页
app.get('/', function (req, res) {
    student.fetch(function (err, students) {
        if (err) {
            console.log(err);
        }
        res.render('list', {  // 渲染index 首页
            title: 'studentsinfo 首页',
            students: students
        });
    });
});

// detail page 详情页
/*app.get('/student/:id', function (req, res) {
    var id = req.params.id;
    student.findById(id, function (err, student) {
        res.render('detail', {
            title: 'studentsinfo' + student.title,
            student: student
        });
    });
});*/

// admin page 后台录入页
app.get('/admin/add', function (req, res) {
    res.render('add', {
        title: '后台录入页',
        student: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});

// admin update student 后台更新页
/*app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        student.findById(id, function (err, student) {
            res.render('admin', {
                title: 'studentsinfo 后台更新页',
                student: student
            });
        });
    }
});*/

// admin post student 后台录入提交
app.post('/admin/student/new', function (req, res) {
    var id = req.body.student._id;
    var studentObj = req.body.student;
    var _student = null;
    if (id !== 'undefined') { // 已经存在的电影数据
        student.findById(id, function (err, student) {
            if (err) {
                console.log(err);
            }
            _student = _underscore.extend(student, studentObj); // 用新对象里的字段替换老的字段
            _student.save(function (err, student) {
                if (err) {
                    console.log(err);
                }
               // res.redirect('/student/' + student._id);
               res.redirect('/admin/list');
            });
        });
    } else {  // 新加的电影
        _student = new student({
            name: studentObj.name,
            info: studentObj.info,
            tel: studentObj.tel,
            addr: studentObj.addr,
            wang: studentObj.wang,
            qq: studentObj.qq,
            orderTime: studentObj.orderTime,
        });
        _student.save(function (err, student) {
            if (err) {
                console.log(err);
            }
           // res.redirect('/student/' + student._id);
           res.redirect('/admin/list');
        });
    }
});

// list page 列表页
app.get('/admin/list', function (req, res) {
    student.fetch(function (err, students) {
        if (err) {
            console.log(err);
        }
         console.log(students);
        res.render('list', {
            title: '列表页',
            students: students
        });
       
    });
});

// list delete student data 列表页删除电影
/*app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    if (id) {
        student.remove({_id: id}, function (err, student) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        });
    }
});*/

