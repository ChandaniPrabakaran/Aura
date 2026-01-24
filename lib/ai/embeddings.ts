import { openai, AI_CONFIG } from './config';

/**
 * Generates vector embeddings for a given text string.
 * This is used for semantic search and long-term memory.
 */
export async function generateEmbedding(text: string) {
    try {
        const response = await openai.embeddings.create({
            model: AI_CONFIG.embeddingModel,
            input: text.replace(/\n/g, ' '),
            encoding_format: 'float',
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}
