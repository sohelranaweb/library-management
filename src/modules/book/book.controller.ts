import { Request, Response } from "express";
import { Book } from "./book.model";

// create book data
const createBook = async (req: Request, res: Response) => {
  try {
    const data = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: "Book Created Successfully",
      data,
    });
  } catch (error) {
     // ✅ Handle duplicate ISBN error
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === 11000
    ) {
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
};

// get all books data
const getBooks = async (req: Request, res: Response) => {
  try {
    const filter = req.query.filter as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sort = req.query.sort === "asc" ? 1 : -1;
    // const limit = parseInt(req.query.limit as string) || 10;

    // const data = await Book.find();
    const query: Record<string, any> = {};
    if (filter) {
      query.genre = filter;
    }

    const books = await Book.find(query)
      .sort({ [sortBy]: sort })
      // .limit(limit);

    res.send({
      success: true,
      message: "Books retrieved Successfully",
      data: books,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error,
      });
    }
  }
};
// get single book by id
const getBookById = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const data = await Book.findById(bookId);

    res.send({
      success: true,
      message: "Book retrieved Successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error,
      });
    }
  }
};

// update book
const updateBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const data = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
      runValidators: true,
    });

    res.send({
      success: true,
      message: "Book updated Successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error,
      });
    }
  }
};
// delete book
const deleteBook = async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const data = await Book.findByIdAndDelete(bookId);

  res.send({
    success: true,
    message: "Mango Deleted Successfully",
    data: null,
  });
};
export const bookController = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};
