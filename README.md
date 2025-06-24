# Library Management

The Library Management API is a backend system designed to manage books, borrowing records, and orders in a library environment. Built with Node.js, Express, TypeScript, and MongoDB, the application follows a modular architecture using Mongoose for schema modeling and validation.

# Core Modules

- Books: Create, read, update, and delete book records with validations such as genre type, ISBN uniqueness, and copy availability.

- Borrowing: Borrow books by validating available stock and reducing the number of copies. Automatically marks books as unavailable when out of stock.

## Features

- CRUD operations for Books
- Borrow and Return Books
- Order Mangoes (sample module with stock check)
- Aggregation reports (e.g., borrow summary)
- Validation with Mongoose
- Mongoose middleware (pre)
- Well-structured with MVC pattern and TypeScript interfaces

## Technologies Used

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB (Mongoose)**
- **Postman** (for testing)
- **Verel** (for live site)

### Book Routes

- **POST** (Create a new book )
- **GET** (Get all books (filter, sort) )
- **GET** (Get book by ID )
- **PUT** (Update book )
- **DELETE** (Delete book )

### borrow Routes

- **POST** (Borrow a book (reduce stock) )
- **GET** (Borrowed book summary report)
