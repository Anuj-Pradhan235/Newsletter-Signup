const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/e57bfb5f04";
  const options = {
    method: "POST",
    auth: "angela:2a208ecdffb40855a60b3ddbea22c802-us21",
  };

  const mailchimpRequest = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (responseData) {
      console.log(JSON.parse(responseData));
    });
  });

  mailchimpRequest.write(jsonData);
  mailchimpRequest.end();
});
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.post("/success", function (req, res) {
  console.log("hello");
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is listening on port :3000");
});
