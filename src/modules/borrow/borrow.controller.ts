import { Request, Response } from "express";
import { Borrow } from "./borrow.model";

const createBorrow = async (req: Request, res: Response) => {
  try {
    const { book, quantity, dueDate } = req.body;

    const borrow = await Borrow.borrowBook(book, quantity, dueDate);
    res.send({
      success: true,
      message: "Book borrowed Successfully",
      data: borrow,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// get book borrowed summery
const borrowSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
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
  } catch (error) {
    res.send({
      success: false,
      message: "Error happened",
      error,
    });
  }
};

export const borrowController = {
  createBorrow,
  borrowSummary,
};
