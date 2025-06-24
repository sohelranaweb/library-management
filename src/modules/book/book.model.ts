import { Schema, model } from "mongoose";
import { IBook } from "./book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      required: true,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: {
      type: Number,
      required: true,
      min: [0, "Copies must be a positive number"],
      validate: {
        validator: Number.isInteger,
        message: "Copies must be an integer",
      },
    },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//  pre mongose middleware use
bookSchema.pre("save", function () {
  // console.log("Pre save doc", this);
  if (this.title) this.title = this.title.trim();
});

export const Book = model<IBook>("Book", bookSchema);
