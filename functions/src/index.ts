import * as functions from "firebase-functions";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Set up the server
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

app.get("/", (req: any, res: any) => {
  const name = process.env.NAME || "World";
  res.send(`Hello ${name}!`);
});

app.get("/console", (req: any, res: any) => {
  res.send("Hello Test!");
});

// Set up the ChatGPT endpoint
app.post("/chat", async (req: any, res: any) => {
  // Get the prompt from the request
  const {prompt} = req.body;

  // Generate a response with ChatGPT
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    console.log(completion?.data?.choices[0]?.message?.content);
    res.send(completion?.data?.choices[0]?.message?.content);
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
});

// // Start the server
// const port = parseInt(process.env.PORT) || 8080;
// app.listen(port, () => {
//   console.log(`helloworld: listening on port ${port}`);
// });

exports.app = functions.https.onRequest(app);
