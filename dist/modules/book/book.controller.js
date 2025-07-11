"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookController = void 0;
const book_model_1 = require("./book.model");
// create book data
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield book_model_1.Book.create(req.body);
        res.status(201).json({
            success: true,
            message: "Book Created Successfully",
            data,
        });
    }
    catch (error) {
        // ✅ Handle duplicate ISBN error
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === 11000) {
            res.status(400).json({
                success: false,
                message: "ISBN already exists.",
                field: "isbn",
            });
        }
        if (error instanceof Error && error.name === "ValidationError") {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error,
            });
        }
    }
});
// get all books data
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.filter;
        const sortBy = req.query.sortBy || "createdAt";
        const sort = req.query.sort === "asc" ? 1 : -1;
        // const limit = parseInt(req.query.limit as string) || 10;
        // const data = await Book.find();
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const books = yield book_model_1.Book.find(query)
            .sort({ [sortBy]: sort });
        // .limit(limit);
        res.send({
            success: true,
            message: "Books retrieved Successfully",
            data: books,
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === "ValidationError") {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error,
            });
        }
    }
});
// get single book by id
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const data = yield book_model_1.Book.findById(bookId);
        res.send({
            success: true,
            message: "Book retrieved Successfully",
            data,
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === "ValidationError") {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error,
            });
        }
    }
});
// update book
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const data = yield book_model_1.Book.findByIdAndUpdate(bookId, req.body, {
            new: true,
            runValidators: true,
        });
        res.send({
            success: true,
            message: "Book updated Successfully",
            data,
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === "ValidationError") {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error,
            });
        }
    }
});
// delete book
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const data = yield book_model_1.Book.findByIdAndDelete(bookId);
    res.send({
        success: true,
        message: "Mango Deleted Successfully",
        data: null,
    });
});
exports.bookController = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
};
