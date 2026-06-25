import dotenv from 'dotenv'
dotenv.config()

const config = {
    MONGO_URI: process.env.MONGO_URI || '',
    MISTRALAI_API_KEY: process.env.MISTRALAI_API_KEY || '',
    COHERE_API_KEY: process.env.COHERE_API_KEY || '',

    FRONTEND_URL: process.env.FRONTEND_URL || "",
    BACKEND_URL: process.env.BACKEND_URL || ""
}

export default config;