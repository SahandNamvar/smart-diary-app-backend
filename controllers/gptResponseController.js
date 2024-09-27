// gptResponseController.js

const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a response
exports.generateResponse = async ({ text_entry, sentiment }) => {
    try {

        // console.log('text_entry:', text_entry);
        // console.log('sentiment:', sentiment);

        // Create a prompt based on the text entry and sentiment
        const prompt = `
        Based on the following text and sentiment, generate a thoughtful and empathetic response.

        Text: "${text_entry}"
        Sentiment Score: ${sentiment.score}
        Sentiment Magnitude: ${sentiment.magnitude}

        Response:
        `;

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // You can adjust the model as needed
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 50, // Adjust as needed
            temperature: 0.7, // Adjust for creativity
            n: 1, // Number of responses to generate
            stop: ['\n'], // Stop generation at a new line
        });

        // Extract and return the response
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating response from OpenAI:', error.message);
        throw new Error('Failed to generate response');
    }
};


// 1. The `generateResponse` function is an asynchronous function that takes an object with `text_entry` and `sentiment` properties as input.
// 2. The function creates a prompt based on the text entry and sentiment to guide the response generation.
// 3. The function then calls the OpenAI API to generate a response using the GPT-3.5 model.
// 4. The response from the API is processed to extract the generated response.
// 5. The extracted response is returned after trimming any extra whitespace.

// This controller handles the interaction with the OpenAI API to generate thoughtful and empathetic responses based on user input and sentiment analysis. 
// The `generateResponse` function encapsulates the logic for creating a prompt, calling the OpenAI API, and processing the response. 
// The function is designed to be reusable and can be easily integrated into other parts of the application that require generating responses.
