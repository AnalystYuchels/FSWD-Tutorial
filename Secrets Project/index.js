// HINTS:
// 1. Import express and axios
import express from "express";
import axios from "axios";

// 2. Create an express app and set the port number.
const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/random";

// 3. Use the public folder for static files.
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// 4. When the user goes to the home page it should render the index.ejs file.
app.set("view engine", "ejs");

// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    const secret = response.data.secret;
    const username = response.data.username;

    res.render("index.ejs", {
      secret: secret,
      user: username,
    });
  } catch (error) {
    console.error("Error fetching secret:", error.message);

    res.render("index.ejs", {
      secret: "Oops! Couldn't fetch a secret right now.",
      user: "Unknown",
    });
  }
});

// 6. Listen on your predefined port and start the server.
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
