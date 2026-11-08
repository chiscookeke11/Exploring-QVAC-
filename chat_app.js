import readline from "node:readline/promises";
import { loadModel, completion, unloadModel, LLAMA_3_2_1B_INST_Q4_0 } from "@qvac/sdk";

const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    modelType: "llm",
    modelConfig: { ctx_size: 4096 },
    onProgress: (p) => process.stderr.write(`\rLoading ${p.percentage.toFixed(0)}%`),
});
console.log("\nModel ready. Type 'exit' to quit.\n");

const history = [
    { role: "system", content: "You are a concise, helpful assistant." },
];
const MAX_MESSAGES = 20; // crude context management

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

while (true) {
    const q = await rl.question("You: ");
    if (q.trim() === "exit") break;
    history.push({ role: "user", content: q });

    const run = completion({ modelId, history, stream: true, kvCache: true });
    process.stdout.write("AI: ");
    for await (const e of run.events) {
        if (e.type === "contentDelta") process.stdout.write(e.text);
    }
    const final = await run.final;
    console.log(`\n   [${final.stats?.tokensPerSecond?.toFixed(1)} tok/s]\n`);

    history.push({
        role: "assistant",
        content: final.cacheableAssistantContent ?? final.contentText,
    });

    // keep the system prompt, trim the oldest turns
    while (history.length > MAX_MESSAGES) history.splice(1, 2);
}

rl.close();
await unloadModel({ modelId });