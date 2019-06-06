"use strict";

const Book       = require("../models/book");
const errorTypes = require("./error_types");

const controller  = {
    newBook: (req,res,next) => {
        if(!req.body.title)
            throw new errorTypes.Error400("title parameter is required");
        let book = new Book({
            title: req.body.title,
            comments: []
        });
        book.save()
            .then(data=>{
                res.json(data);
            })
            .catch(err=>next(err));
    },
    getBooks: (req,res,next) => {
        Book.find({}).lean().exec()
            .then(data=>{
                data.map(e => {
                    e.commentcount = e.comments.length;
                    delete e.comments;
                    return e;
                });

                res.json(data);
            })
            .catch(err=>next(err));
    },
    deleteBooks: (req,res,next) => {
        Book.deleteMany({})
            .then(res.json({message:"complete delete successful"}))
            .catch(err=>next(err));
    },
    getBookById: (req,res,next) => {
        Book.findById(req.params.id)
            .then(data=>{
                if(data)
                    res.json(data);
                else
                    throw new errorTypes.Error404("no book exists");
            })
            .catch(err=>next(err));
    },
    deleteBook: (req,res,next) => {
        Book.deleteOne({_id:req.params.id})
            .then(res.json({message:"delete successful"}))
            .catch(err=>next(err));
    },
    newComment: (req, res, next) => {
        Book.findOne({_id: req.params.id})
            .then(data=>{
                if(data){
                    data.comments.push(req.body.comment);
                    return data.save();
                }
                else
                    throw new errorTypes.Error404("no book exists");

            })
            .then(data=>res.json(data))
            .catch(err=>next(err));
    }

};


module.exports = controller;