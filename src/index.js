require("dotenv").config();
const connectDB = require("./db/index.js");
const app = require("./app.js");

PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port : `, process.env.PORT);
    });
    app.on("error", (error) => {
      console.log(`error: ${error}`);
      throw error;
    });
  })
  .catch((error) => {
    console.log(`MongoDB Connection failed !!  `, error);
  });
