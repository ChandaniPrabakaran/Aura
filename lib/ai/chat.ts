import { openai, AI_CONFIG, AURA_PERSONALITY } from './config';
import { getAuraMemoryContext, saveMessageWithMemory } from './memory';
import { auraTools } from './tools';

export async function chatWithAura(userId: string, userMessage: string, chatHistory: any[] = [], context?: any) {
    // 1. Fetch relevant long-term memories (Ideas + Past Conversations)
    const memoryContext = await getAuraMemoryContext(userId, userMessage);

    // 1.1 Process Dashboard Context if provided
    let dashboardContext = "";
    if (context) {
        dashboardContext = `\n[CURRENT DASHBOARD CONTEXT]\n` +
            `- Active Goals: ${context.active_goals?.join(', ') || 'None'}\n` +
            `- Pending Tasks: ${context.pending_tasks?.join(', ') || 'None'}\n` +
            `- Recent Ideas: ${context.recent_ideas?.join(', ') || 'None'}\n` +
            `- Upcoming Events: ${context.upcoming_events?.join(', ') || 'None'}\n`;
    }

    // 2. Prepare System Prompt with Personality + Memory + Dashboard Context
    const messages: any[] = [
        {
            role: 'system',
            content: `${AURA_PERSONALITY}\n${memoryContext}${dashboardContext}`
        },
        ...chatHistory,
        { role: 'user', content: userMessage }
    ];

    // 3. Initial Chat Call with Tool Support
    const response = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages,
        tools: [
            {
                type: 'function',
                function: {
                    name: 'createTodo',
                    description: 'Create a new task or todo',
                    parameters: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            description: { type: 'string' },
                            dueDate: { type: 'string', description: 'ISO format date string' },
                            priority: { type: 'string', enum: ['low', 'medium', 'high'] }
                        },
                        required: ['title']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'saveIdea',
                    description: 'Save a new idea, thought, or brainstorm',
                    parameters: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            content: { type: 'string' },
                            tags: { type: 'array', items: { type: 'string' } }
                        },
                        required: ['title', 'content']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'createGoal',
                    description: 'Set a new long-term goal',
                    parameters: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            description: { type: 'string' },
                            targetDate: { type: 'string', description: 'ISO format target date' }
                        },
                        required: ['title']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'updateGoalProgress',
                    description: 'Update the progress percentage of an existing goal',
                    parameters: {
                        type: 'object',
                        properties: {
                            goalId: { type: 'string' },
                            progress: { type: 'number', description: '0 to 100' }
                        },
                        required: ['goalId', 'progress']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'scheduleMeeting',
                    description: 'Schedule a manifestation or event in the user local 2026 timeline',
                    parameters: {
                        type: 'object',
                        properties: {
                            summary: { type: 'string' },
                            start: { type: 'string', description: 'ISO format start time' },
                            end: { type: 'string', description: 'ISO format end time' },
                            description: { type: 'string' }
                        },
                        required: ['summary', 'start', 'end']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'checkAvailability',
                    description: 'Scan the user 2026 trajectory for a specific day to check availability',
                    parameters: {
                        type: 'object',
                        properties: {
                            day: { type: 'string', description: 'Date to scan (e.g., 2026-05-15)' }
                        },
                        required: ['day']
                    }
                }
            }
        ],
        tool_choice: 'auto',
    });

    const responseMessage = response.choices[0].message;

    // 4. Handle Tool Interactions
    if (responseMessage.tool_calls) {
        const toolCalls = responseMessage.tool_calls;
        messages.push(responseMessage);

        for (const toolCall of toolCalls) {
            if (toolCall.type !== 'function') continue;

            const functionName = (toolCall as any).function.name as keyof typeof auraTools;
            const functionArgs = JSON.parse((toolCall as any).function.arguments);

            let result;
            try {
                // Correctly map arguments for each tool
                switch (functionName) {
                    case 'createTodo':
                        result = await auraTools.createTodo(userId, functionArgs.title, functionArgs.description, functionArgs.dueDate, functionArgs.priority);
                        break;
                    case 'saveIdea':
                        result = await auraTools.saveIdea(userId, functionArgs.title, functionArgs.content, functionArgs.tags);
                        break;
                    case 'createGoal':
                        result = await auraTools.createGoal(userId, functionArgs.title, functionArgs.description, functionArgs.targetDate);
                        break;
                    case 'updateGoalProgress':
                        result = await auraTools.updateGoalProgress(userId, functionArgs.goalId, functionArgs.progress);
                        break;
                    case 'scheduleMeeting':
                        result = await auraTools.scheduleMeeting(userId, functionArgs.summary, functionArgs.start, functionArgs.end, functionArgs.description);
                        break;
                    case 'checkAvailability':
                        result = await auraTools.checkAvailability(userId, functionArgs.day);
                        break;
                    default:
                        result = `Tool ${functionName} not found.`;
                }
            } catch (error: any) {
                console.error(`Tool Error (${functionName}):`, error);
                result = `Error: ${error.message}`;
            }

            messages.push({
                tool_call_id: toolCall.id,
                role: 'tool',
                name: functionName,
                content: JSON.stringify(result),
            });
        }

        const secondResponse = await openai.chat.completions.create({
            model: AI_CONFIG.model,
            messages,
        });

        const finalReply = secondResponse.choices[0].message.content || "";

        // Save both sides to memory for future recall
        await saveMessageWithMemory(userId, 'user', userMessage);
        await saveMessageWithMemory(userId, 'assistant', finalReply);

        return finalReply;
    }

    const reply = responseMessage.content || "";

    // No tool call, just save regular interaction to memory
    await saveMessageWithMemory(userId, 'user', userMessage);
    await saveMessageWithMemory(userId, 'assistant', reply);

    return reply;
}
