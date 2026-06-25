// import { ChatOpenAI } from "@langchain/openai";
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatCohere } from '@langchain/cohere'
// import { ChatOllama} from '@langchain/ollama'
import config from '../config/config.js'


// export const openAIModel = new ChatOllama({
//     model:  "qwen2.5-coder:7b",
//     apiKey: config.OPENAI_API_KEY,
// })

 
export const mistralAIModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRALAI_API_KEY,
})


export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY,
})



