const Express = require("express");
const BodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
var app = Express();
var cors = require("cors");
const fs = require("fs");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var dataJwt = {
  secretKey: "this is my secret key",
  algorithm: "HS512",
};

// jwt.verify(token, data.secretKey);

app.post("/", (req, res) => {
  data = req.body.data;
  let token = jwt.sign(
    data,
    dataJwt.secretKey,
    { algorithm: dataJwt.algorithm },
  );
  res.status(201).send(token);
});

app.post("/verify", (req, res) => {
  token = req.headers.token;
  jwt.verify(
    token,
    dataJwt.secretKey,
    {
      algorithms: dataJwt.algorithm,
    },
    function (error, decodeed) {
      if (error) {
        let errordata = {
          message: error.message,
          expiredAt: error.expiredAt,
        };
        res.status(401).send(errordata);
      }
    }
  );
  res.status(201).json(true);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("<- - - - - - - -Server Started- - - - - - - >");
});
