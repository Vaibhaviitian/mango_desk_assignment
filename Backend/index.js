import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
console.log(process.env.GROQ_API_KEY);
app.listen(PORT, () => {
  console.log(`⚙️ Server is running at port: ${process.env.PORT || 1000} 🚀`);
});