const monggose = require("mongoose");

// Connect to mongodb
monggose.connect("mongodb://127.0.0.1:27017/preparation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
