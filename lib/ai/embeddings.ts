import { embeddingClient, AI_CONFIG } from './config';

/**
 * Generates vector embeddings for a given text string.
 * This is used for semantic search and long-term memory.
 *
 * NOTE: Embeddings require a direct OpenAI key (OPENAI_API_KEY).
 * When running with OpenRouter only, this returns a zero vector gracefully.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    // Skip if no direct OpenAI client is available (OpenRouter-only mode)
    if (!embeddingClient || !AI_CONFIG.embeddingsEnabled) {
        return new Array(1536).fill(0);
    }

    try {
        const response = await embeddingClient.embeddings.create({
            model: AI_CONFIG.embeddingModel,
            input: text.replace(/\n/g, ' '),
            encoding_format: 'float',
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding, using fallback:', error);
        // Fallback to zero vector to prevent tool failure
        return new Array(1536).fill(0);
    }
}
