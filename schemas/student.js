var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
    name: String,
    info: String,
    tel: String,
    addr: String,
    wang: String,
    qq: String,
    orderTime: String,
    
    // meta 更新或录入数据的时间记录
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        },
    }
});

// studentSchema.pre 表示每次存储数据之前都先调用这个方法
studentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

// studentSchema 模式的静态方法
studentSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

// 导出studentSchema模式
module.exports = studentSchema;