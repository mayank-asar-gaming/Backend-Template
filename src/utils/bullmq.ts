import { Queue, Worker } from "bullmq";
import { connect, getClient } from "./redis";

// Define message queue names
export const MESSAGE_QUEUES = {
    ORDER: "ORDER",
    PUBLISH: "PUBLISH",
    FAILED_JOBS: "FAILED_JOBS",
    EXIT_ORDER: "EXIT_ORDER",
    CANCEL_ORDER: "CANCEL_ORDER",
} as const;

// Type for the message queues
type MessageQueues = keyof typeof MESSAGE_QUEUES;

// Typed containers for queues and workers
let queues: Record<MessageQueues, Queue | undefined> = {} as Record<MessageQueues, Queue | undefined>;
let workers: Record<MessageQueues, Worker | undefined> = {} as Record<MessageQueues, Worker | undefined>;
let redisConnection: ReturnType<typeof getClient> | null = null;

// Initialize Redis connection and queues/workers
(async () => {
    try {
        await connect(); // Ensure Redis is connected
        redisConnection = getClient(); // Use the Redis client
        console.log("Queues and workers initialized successfully.");
    } catch (error) {
        console.error("Error initializing BullMQ or Redis:", error);
    }
})();

/**
 * Get or create a queue by name
 * @param queueName The name of the queue
 * @returns A promise resolving to the queue
 */
export async function getOrCreateQueue(queueName: MessageQueues): Promise<Queue> {
    if (!queues[queueName]) {
        queues[queueName] = new Queue(queueName, { connection: redisConnection as any });
    }
    return queues[queueName]!;
}

/**
 * Add data to a queue
 * @param queueName The name of the queue
 * @param payload The data to be added to the queue
 * @param options Options for the job (e.g., priority, delay)
 */
export async function sendDataToQueue(queueName: MessageQueues, payload: any, options = {}): Promise<void> {
    try {
        const queue = await getOrCreateQueue(queueName);
        await queue.add(queueName, payload, options);
        console.log(`Added job to queue "${queueName}"`);
    } catch (error) {
        console.error(`Error adding job to queue "${queueName}":`, error);
        throw error;
    }
}

/**
 * Create or retrieve a worker for a queue
 * @param queueName The name of the queue
 * @param messageHandler Function to handle jobs
 * @param options Options for the worker
 */
export function consumeQueue(queueName: MessageQueues, messageHandler: (data: any) => Promise<void>, options = {}): void {
    if (!workers[queueName]) {
        workers[queueName] = new Worker(
            queueName,
            async (job) => {
                try {
                    await messageHandler(job.data);
                    console.log(`Processed job from queue "${queueName}"`);
                } catch (error) {
                    console.error(`Error processing job from queue "${queueName}":`, error);
                    await sendDataToQueue(MESSAGE_QUEUES.FAILED_JOBS, {
                        queueName,
                        payload: job.data,
                        error: error?.toString() || "Unknown error",
                    });
                }
            },
            { connection: redisConnection as any, ...options },
        );

        workers[queueName].on("failed", (job, err) => {
            console.error(`Job failed in queue "${queueName}":`, job?.id, err);
        });

        console.log(`Worker for queue "${queueName}" started successfully.`);
    }
}

/**
 * Close all queues and workers
 */
export async function closeAllQueues(): Promise<void> {
    for (const queueName of Object.keys(queues) as MessageQueues[]) {
        if (queues[queueName]) {
            await queues[queueName]!.close();
        }
    }
    for (const queueName of Object.keys(workers) as MessageQueues[]) {
        if (workers[queueName]) {
            await workers[queueName]!.close();
        }
    }
    console.log("All queues and workers closed.");
}
