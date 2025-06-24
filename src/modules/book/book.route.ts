import { Router } from "express";
import { bookController } from "./book.controller";

const bookRoute = Router();
bookRoute.post("/", bookController.createBook);
bookRoute.put("/:bookId", bookController.updateBook);
bookRoute.delete("/:bookId", bookController.deleteBook);
bookRoute.get("/:bookId", bookController.getBookById);
bookRoute.get("/", bookController.getBooks);

export default bookRoute;
