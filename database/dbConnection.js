import { connect } from "mongoose";

export const dbConnection = connect(
  "mongodb://127.0.0.1:27017/E-commerce"
).then(() => {
  console.log("Database is connected successfully.");
});
