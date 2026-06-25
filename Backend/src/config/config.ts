import dotenv from 'dotenv'
dotenv.config()

const config = {
    MONGO_URI: process.env.MONGO_URI || '',
    // OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    MISTRALAI_API_KEY: process.env.MISTRALAI_API_KEY || '',
    COHERE_API_KEY: process.env.COHERE_API_KEY || '',
}

export default config;