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
exports.borrowController = void 0;
const borrow_model_1 = require("./borrow.model");
const createBorrow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        const borrow = yield borrow_model_1.Borrow.borrowBook(book, quantity, dueDate);
        res.send({
            success: true,
            message: "Book borrowed Successfully",
            data: borrow,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
});
// get book borrowed summery
const borrowSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
            // Group borrow records by book and sum the quantity
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            // lookup book details from book collection
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo",
                },
            },
            // Unwind the array of bookInfo
            {
                $unwind: "$bookInfo",
            },
            // project fields
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.send({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
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
exports.borrowController = {
    createBorrow,
    borrowSummary,
};
