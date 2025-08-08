const { dbConnection } = require("./src/database/db");
const { app } = require("./src/app");
require("dotenv").config();
dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `CLICON app listening on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log("Error from connecting Database, ", err);
  });
