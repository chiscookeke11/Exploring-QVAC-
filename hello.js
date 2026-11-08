import { completion, LLAMA_3_2_1B_INST_Q4_0, loadModel, unloadModel } from "@qvac/sdk";


const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    modelType: "llm",
    onProgress: (p) => console.log(`Downloading ${p.percentage.toFixed(0)}%`)
});

const run = completion({
    modelId,
    history: [{
        role: "user",
        content: "Say hello in one sentence.",
    }],
    stream: true
});


for await (const event of run.events) {
    if (event.type === "contentDelta") process.stdout.write(event.text);
}


await unloadModel({ modelId })

