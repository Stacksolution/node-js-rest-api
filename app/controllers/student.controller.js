const Student = require('../models/student.model.js');


// Create and Save a new Student
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        return res.status(400).send({
            status: false,
            message: "Student Name can not be empty !"
        });
    }

    if (!req.body.age) {
        return res.status(400).send({
            status: false,
            message: "Student Age can not be empty !"
        });
    }

    // Create a Student
    const student = new Student({
        name: req.body.name || "Untitled Student",
        age: req.body.age
    });

    // Save Student in the database
    student.save()
        .then(data => {
            res.status(200).send({
                status: true,
                message: data
            });
        }).catch(err => {
            res.status(500).send({
                status: false,
                message: err.message || "Some error occurred while creating the Student."
            });
        });
};

// Retrieve and return all student from the database.
exports.studentAll = (req, res) => {
    Student.find()
        .then(data => {
            res.status(200).send({
                status: true,
                message: data
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving student."
            });
        });
};

// Find a single note with a studentId
exports.findOne = (req, res) => {

    Student.findById(req.body.studentId)
        .then(student => {
            if (!student) {
                return res.status(404).send({
                    status: false,
                    message: "Student not found with id " + req.body.studentId
                });
            }

            return res.status(200).send({
                status: true,
                message: "Student found with id " + req.body.studentId,
                data: student
            });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    status: false,
                    message: "Student not found with id " + req.body.studentId
                });
            }
            return res.status(500).send({
                status: false,
                message: "Error retrieving note with id " + req.body.studentId
            });
        });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.name) {
        return res.status(400).send({
            status: false,
            message: "Note content can not be empty"
        });
    }

    // Find note and update it with the request body
    Student.findByIdAndUpdate(req.params.studentId, {
        name: req.body.name || "Untitled Note",
        age: req.body.age
    }, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    status: false,
                    message: "Student not found with id " + req.params.studentId
                });
            }
            res.status(200).send({
                status: true,
                message: "Student records updtaed with id " + req.params.studentId
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    status: false,
                    message: "Students not found with id " + req.params.studentId
                });
            }
            return res.status(500).send({
                status: false,
                message: "Error updating students with id " + req.params.studentId
            });
        });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Student.findByIdAndRemove(req.params.studentId)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    status: false,
                    message: "Student not found with id " + req.params.studentId
                });
            }
            return res.status(200).send({
                status: true,
                message: "Student deleted successfully!" + req.params.studentId
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    status: false,
                    message: "Student not found with id " + req.params.studentId
                });
            }
            return res.status(500).send({
                status: false,
                message: "Could not delete student with id " + req.params.studentId
            });
        });
};