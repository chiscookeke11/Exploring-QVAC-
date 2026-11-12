const { loadModel, QWEN3_1_7B_INST_Q4 } = require("@qvac/sdk");




// Core idea (the full file has validation and the approval prompt)
const modelId = await loadModel({
    modelSrc: QWEN3_1_7B_INST_Q4, modelType: "llm",
    modelConfig: { ctx_size: 4096, tools: true },
});

const run = completion({ modelId, history, tools, stream: true, generationParams: { temp: 0 } });
for await (const e of run.events) if (e.type === "contentDelta") process.stdout.write(e.text);
const final = await run.final;

for (const c of final.toolCalls) {            // the model asked for tools
    const result = await runTool(c.name, c.arguments);   // YOUR code runs them
    history.push({ role: "tool", toolCallId: c.id, toolName: c.name, content: result });
}
// loop again so the model can answer using the results