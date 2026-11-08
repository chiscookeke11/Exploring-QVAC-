import { assessModelFit, QWEN3_8B_INST_Q4_K_M } from "@qvac/sdk";



const result = await assessModelFit({
    models: [{
        model: QWEN3_8B_INST_Q4_K_M,
        modelType: "llamacpp-completion",
        workload: {
            kind: "llm",
            contextTokens: 8192
        }
    }],
    execution: "sequential",
    policy: "interactive-v1"
});

console.log(result)