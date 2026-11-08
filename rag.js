import fs from "node:fs";
import path from "node:path";
import {
    loadModel, unloadModel, completion,
    ragIngest, ragSearch, ragCloseWorkspace,
    GTE_LARGE_FP16, LLAMA_3_2_1B_INST_Q4_0,
} from "@qvac/sdk";

const WORKSPACE = "my-docs";

const embId = await loadModel({ modelSrc: GTE_LARGE_FP16, modelType: "embeddings" });
const llmId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    modelType: "llm",
    modelConfig: { ctx_size: 4096 },
});

// 1. Ingest. Chunking is on by default; the docs' short-sentence example passes chunk:false
const documents = fs.readdirSync("./docs")
    .filter((f) => /\.(txt|md)$/.test(f))
    .map((f) => fs.readFileSync(path.join("./docs", f), "utf8"));
await ragIngest({ modelId: embId, workspace: WORKSPACE, documents });

// 2. Retrieve
const question = process.argv[2] ?? "What is this document about?";
const hits = await ragSearch({ modelId: embId, workspace: WORKSPACE, query: question, topK: 3 });
const context = hits.map((h, i) => `[${i + 1}] ${h.content}`).join("\n\n");

// 3. Generate, grounded in the retrieved text
const run = completion({
    modelId: llmId,
    stream: true,
    history: [
        { role: "system", content: "Answer ONLY from the context below. If the answer isn't there, say you don't know." },
        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
    ],
});
for await (const e of run.events) {
    if (e.type === "contentDelta") process.stdout.write(e.text);
}

await ragCloseWorkspace({ workspace: WORKSPACE }); // leave out deleteOnClose to keep the index
await unloadModel({ modelId: llmId });
await unloadModel({ modelId: embId });