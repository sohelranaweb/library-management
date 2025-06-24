// src/app/models/borrow.model.ts
import mongoose, { Schema, model } from "mongoose";
import { BorrowModel, IBorrow } from "./borrow.interface";
import { Book } from "../book/book.model";

const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: mongoose.Schema.ObjectId, ref: "Book", required: true },
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
        validator: (val: Date) => val > new Date(),
        message: "Due date must be in the future",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// static method
borrowSchema.statics.borrowBook = async function (bookId, quantity, dueDate) {
  const book = await Book.findById(bookId);

  // book exist or not
  if (!book) throw new Error("Book not Found");

  // check book quantity
  if (book.copies < quantity) {
    throw new Error("Not enough copies available");
  }

  // Deduct quantity
  book.copies -= quantity;
  if (book.copies === 0) {
    book.available = false;
  }
  await book.save();

  // Create borrow record
  const borrowRecord = await this.create({
    book: bookId,
    quantity,
    dueDate,
  });
  return borrowRecord;
};

export const Borrow = model<IBorrow, BorrowModel>("Borrow", borrowSchema);
