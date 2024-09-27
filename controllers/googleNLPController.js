// Handles Google NLP API calls (sentiment analysis)

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Handle Google NLP API
exports.analyzeSentiment = async (text) => {
    try {
        // Call Google NLP API
        const response = await axios.post(
            'https://language.googleapis.com/v1/documents:analyzeSentiment?key=' + process.env.GOOGLE_API_KEY, 
            {
                document: {
                    type: 'PLAIN_TEXT',
                    content: text,
                },
                encodingType: 'UTF8',
            }
        );

        // Extract sentiment data
        const sentiment = response.data.documentSentiment;
        return {
            score: sentiment.score, // Sentiment score ranges from -1 to 1
            magnitude: sentiment.magnitude, // Sentiment magnitude (strenght) ranges from 0 to +inf
        };
        
    } catch (error) {
        console.log('Error analyzing sentiment: ', error.message);
        throw new Error('Sentiment analysis failed');
    }
};

// 1. The `analyzeSentiment` function is an asynchronous function that takes a `text` parameter as input.
// 2. The function makes an HTTP POST request to the Google NLP API to analyze the sentiment of the text.
// 3. The response from the API is then processed to extract the sentiment score and magnitude.
// 4. The extracted sentiment data is returned as an object with `score` and `magnitude` properties.
// 5. If an error occurs during the API call or processing, an error is thrown with an appropriate message.