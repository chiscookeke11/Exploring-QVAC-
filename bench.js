
import os from "node:os"
import { completion, LLAMA_3_2_1B_INST_Q4_0, loadModel, QWEN3_600M_INST_Q4, unloadModel } from "@qvac/sdk";




const modelId = await loadModel({
    modelSrc: QWEN3_600M_INST_Q4,
    modelType: "llm",
    modelConfig: {
        ctx_size: 2048
    }
})


const prompts = [
    "Explain what a neural network is in 3 sentences",
    "List five uses of on-device AI",
    "Write a short poem about Enugu"
]



const speeds = []



for (const p of prompts) {
    const run = completion({
        modelId,
        history: [{
            role: "user",
            content: p
        }],
        stream: true,
        generationParams: {
            temp: 0,
            predict: 128
        }
    });
    const final = await run.final;
    const tps = final.stats.tokensPerSecond
    console.log(`${tps.toFixed(1)} tok/s`)
}



const avg = speeds.reduce((a, b) => a + b, 0)
console.log("\n--- POST THIS ---");
console.log(`Model: Llama 3.2 1B Q4_0`);
console.log(`Avg: ${avg.toFixed(1)} tok/s`);
console.log(`CPU: ${os.cpus()[0].model} (${os.cpus().length} cores)`);
console.log(`RAM: ${(os.totalmem() / 1e9).toFixed(1)} GB`);


await unloadModel({ modelId })