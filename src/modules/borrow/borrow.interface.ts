import { Model, Types } from "mongoose";

export interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

// static method 
export interface BorrowModel extends Model<IBorrow> {
  borrowBook(
    bookId: Types.ObjectId,
    quantity: number,
    dueDate: Date
  ): Promise<IBorrow>;
}
