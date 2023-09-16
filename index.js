
const express=require("express")
const axios=require("axios")
const dotenv=require("dotenv")
const cors=require("cors")
const OpenAI = require('openai');
const { Octokit } = require("@octokit/rest");
const fs = require("fs");

 dotenv.config()

 
const app=express()

const port = process.env.PORT || 5000;

app.use(express.json())

app.use(cors())

const apiKey = process.env.OPENAI_API_KEY // Replace with your actual OpenAI API key
 const openai = new OpenAI({ apiKey });
 
//  const octokit = new Octokit({
//   auth: process.env.GITHUB_TOKEN, // Replace with your PAT
 
// });

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:5000', // Replace with your actual server URL
// });

app.post('/convert', async (req, res) => {
  try {
    const { sourceCode, targetLanguage } = req.body;
       console.log(req.body)
    // Create a chat completion request
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Convert the following ${sourceCode} code to ${targetLanguage} code correctly and print the updated code.` }
      ],
      model: "gpt-3.5-turbo",
    });

    
   
    const translatedCode = completion.choices[0].message.content;
    res.json({ translatedCode });
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    res.status(500).json({ error: '500' });
  }
});


app.post('/debug', async (req, res) => {
  try {
    const { sourceCode } = req.body;
    console.log(req.body)
    // Create a chat completion request for debugging
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that debugs code." },
        { role: "user", content: `Debug the following errors present in this code ${sourceCode} and provide the updated code.` }
      ],
      model: "gpt-3.5-turbo",
    });

    // Extract the response
    const debugResponse = completion.choices[0].message.content;

    res.json({ debugResponse });
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    res.status(500).json({ error: '500' });
  }
});

app.post('/quality', async (req, res) => {
  try {
    const { sourceCode } = req.body;
    console.log(req.body)
    // Create a chat completion request for quality assessment
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that assesses code quality." },
        { role: "user", content: `Please provide an overall code quality assessment percentage for the given code:\n${sourceCode}\nConsider the following parameters:\nCode Consistency,Code Performance,Error Handling,Code Testability,Code Readability` }
      ],
      model: "gpt-3.5-turbo",
    });

    // Extract the response
    const qualityResponse = completion.choices[0].message.content;

    res.json({ qualityResponse });
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    res.status(500).json({ error: '500' });
  }
});


// app.post("/github-push", async (req, res) => {
//   try {
//     // Get the code to push from the request body
//     const { sourceCode } = req.body;

//     // Specify GitHub repository details
//     const repoOwner = "GaneshYadav3142"; // Your GitHub username
//     const repoName = "CodeEditor_Code_Pushing_TestingRepo"; // Your GitHub repository name
//     const filePath = "./translated-code.json"; // Specify the file path

//     // Create a JSON file with the code to push
//     fs.writeFileSync(filePath, JSON.stringify({ code: sourceCode }, null, 2));

//     const response = await octokit.repos.createOrUpdateFileContents({
//       owner: repoOwner,
//       repo: repoName,
//       path: "/translated-code.json",
//       message: "Add code to push", // Commit message
//       content: fs.readFileSync(filePath).toString("base64"),
//     });

//     // Push the file to GitHub using the PAT
//     console.log(response)

//     // The response contains information about the commit
//     res.json({ githubResponse: response.data });
//   } catch (error) {
//     console.error("GitHub Push Error:", error.message);
//     res.status(500).json({ error: "GitHub Push Failed" });
//   }
// });



app.listen(port,()=>{
    console.log("server is listening at port 5000")
})