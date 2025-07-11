"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.Borrow = void 0;
// src/app/models/borrow.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const book_model_1 = require("../book/book.model");
const borrowSchema = new mongoose_1.Schema({
    book: { type: mongoose_1.default.Schema.ObjectId, ref: "Book", required: true },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
        validate: {
            validator: Number.isInteger,
            message: "Quantity must be an integer",
        },
    },
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: (val) => val > new Date(),
            message: "Due date must be in the future",
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
// static method
borrowSchema.statics.borrowBook = function (bookId, quantity, dueDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield book_model_1.Book.findById(bookId);
        // book exist or not
        if (!book)
            throw new Error("Book not Found");
        // ✅ Validate dueDate
        const parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime()) || parsedDueDate <= new Date()) {
            throw new Error("Due date must be in the future");
        }
        // check book quantity
        if (book.copies < quantity) {
            throw new Error("Not enough copies available");
        }
        // Deduct quantity
        book.copies -= quantity;
        if (book.copies === 0) {
            book.available = false;
        }
        yield book.save();
        // Create borrow record
        const borrowRecord = yield this.create({
            book: bookId,
            quantity,
            dueDate,
        });
        return borrowRecord;
    });
};
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
