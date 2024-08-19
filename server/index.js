const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const autheRouter = require('./router/auth')

app.use(cors());
app.use(express.json());
app.use('/api/auth',autheRouter)

app.listen(process.env.PORT, () =>
  console.log(`server raning in port ${process.env.PORT}`)
);
