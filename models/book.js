"use strict";

const mongoose    = require("mongoose");
const Schema      = mongoose.Schema;

const BookSchema = Schema({
    title: {type: String, required: true},
    comments: [String]
});

module.exports = mongoose.model("Book", BookSchema, "books");