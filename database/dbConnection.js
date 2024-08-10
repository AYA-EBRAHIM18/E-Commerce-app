import { connect } from "mongoose";

export const dbConnection = connect(
  "mongodb+srv://e-commerce:dZp6JWPxkQqajxjZ@cluster0.3hdqd.mongodb.net/E-commerce"
).then(() => {
  console.log("Database is connected successfully.");
});
