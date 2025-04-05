import express from 'express';
import { HfInference } from '@huggingface/inference';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 5000;

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/api/review', async (req, res) => {
    const { code } = req.body;
    
    console.log('Received code:', code); // Log the received code
    if (!code) {
        return res.status(400).send({ error: 'Code is required' });
    }

    try {
        const response = await hf.request({
            model: 'EleutherAI/gpt-neo-1.3B',
            inputs: `Analyze the following JavaScript/TypeScript code and provide feedback on best practices, performance, and possible errors: \n\n${code}`,
            parameters: {
                max_length: 500,
                temperature: 0.7,
            },
        });

        if (response && response[0] && response[0].generated_text) {
            const text = response[0].generated_text;
        
            if (text.includes('A:')) {
         
                const indexOfA = text.indexOf('A:') + 2; 
                const feedbackAfterA = text.slice(indexOfA).trim();
        
                if (feedbackAfterA) {
                    return res.json({ feedback: feedbackAfterA });
                } else {
                    return res.status(500).send({ error: 'No feedback after "A:"' });
                }
            } else {
                return res.status(500).send({ error: 'Response does not contain expected "A:"' });
            }
        } else {
            return res.status(500).send({ error: 'Unexpected response structure' });
        }
        
        
    }
    catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send({ error: 'Internal Server Error' });
    };
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;


//openAi version

// import express from 'express';
// import OpenAI from 'openai';
// import dotenv from 'dotenv';
// dotenv.config();
// const router = express.Router();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });
// console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

// router.post('/', async (req, res) => {
//   const { code } = req.body;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "You are an expert JavaScript/TypeScript code reviewer."
//         },
//         {
//           role: "user",
//           content: `Analyze this code:\n\n${code}`
//         }
//       ]
//     });

//     res.json({ feedback: response.choices[0].message.content });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ feedback: 'Failed to generate feedback.' });
//   }
// });

// export default router;
