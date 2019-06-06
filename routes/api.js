/*
*
*
*       Complete the API routing below
*
*
*/

"use strict";

const BookController    = require("../controllers/book");


module.exports = function (app) {

    app.route("/api/books")
        .get(BookController.getBooks)

        .post(BookController.newBook)

        .delete(BookController.deleteBooks);



    app.route("/api/books/:id")
        .get(BookController.getBookById)

        .post(BookController.newComment)

        .delete(BookController.deleteBook);

};
