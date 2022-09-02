const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "630ee3d1db689ba5de083a1e"
  };

  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    useUnifiedTopology: false
  });

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

main();
