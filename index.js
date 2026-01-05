const app = require("./app");
const connectDB = require("./src/config/db");

require("dotenv").config();

const port = process.env.PORT;

app.listen(port, async () => {
  console.log(`Server run successfully at http://localhost:${port}`);
  await connectDB();
});
