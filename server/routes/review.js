import express from 'express';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

router.post('/', async (req, res) => {
    const { code } = req.body;
    console.log('Received code:', code);  // Log the received code
    
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });  // Return JSON error
    }

    try {
        const response = await hf.textGeneration({
            model: 'tiiuae/falcon-7b-instruct',
            inputs: `Analyze the following JavaScript/TypeScript code and provide feedback on best practices, performance, and possible errors: \n\n${code}`,
            parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
            },
        });

        // Log the full response to check the structure
        console.log('HuggingFace response:', response);

        if (response && response.generated_text) {
            const text = response.generated_text;
            console.log('Generated text:', text);  // Log the generated text

            return res.json({ feedback: text });  // Send the response with structured feedback
        } else {
            return res.status(500).json({ error: 'Failed to generate feedback from HuggingFace' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });  // Return JSON error
    }
});

export default router;

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
