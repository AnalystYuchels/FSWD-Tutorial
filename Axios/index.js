import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;

    res.render("index.ejs", {
      activity: result.activity,
      type: result.type,
      participants: result.participants,
      error: null,
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);

    res.render("index.ejs", {
      error: "Could not fetch an activity. Try again!",
    });
  }
});

app.post("/", async (req, res) => {

  // Step 2: Play around with the drop downs and see what gets logged.
  // Use axios to make an API request to the /filter endpoint. Making
  // sure you're passing both the type and participants queries.
  // Render the index.ejs file with a single *random* activity that comes back
  // from the API request.
  // Step 3: If you get a 404 error (resource not found) from the API request.
  // Pass an error to the index.ejs to tell the user:
  // "No activities that match your criteria."

  const { type, participants } = req.body;

  try {
    const response = await axios.get(
      `https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`
    );

    const results = response.data;

    // Pick a random activity from the list
    const randomActivity = results[Math.floor(Math.random() * results.lenth)];

    res.render("index.ejs", {
      activity: randomActivity.activity,
      type: randomActivity.type,
      participants: randomActivity.participants,
      error: null,
    });
  } catch (error) {
    console.error("Error fetching filtered activity", error.message);

    res.render("index.ejs", {
      activity: null,
      type: null,
      participants: null,
      error: "No activities that match your criteria.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
