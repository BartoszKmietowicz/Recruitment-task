import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import reviewRoute from './routes/review.js'; // ✅ Include `.js` extension

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/review', reviewRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
