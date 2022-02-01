const mongoose = require('mongoose');

const Student = mongoose.Schema({
    name: String,
    age: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', Student);