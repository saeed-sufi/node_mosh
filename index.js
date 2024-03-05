const error = require("./middleware/error");
const debug = require("debug")("app:startup");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const express = require("express");
const config = require("config");
const morgan = require("morgan");
require("./dbConfig");
require("./models/index");
const helmet = require("helmet");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vidly Library API",
      version: "1.0.0",
      description: "Library API for the movie database app, Vidly",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
const app = express();

// console.log(app.get('env'))
// console.log("NODE_ENV: " + process.env.NODE_ENV)
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwrPrivateKey is not defined.");
  process.exit(1);
}
console.log("Application Name: " + config.get("name"));

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true })); //key=value -> req.body
app.use(express.static("public"));
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}
require("./startup/routes")(app);
app.use(error);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port));
