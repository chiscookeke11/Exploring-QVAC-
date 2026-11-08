import { loadModel, BERGAMOT_EN_FR, translate, unloadModel } from "@qvac/sdk";



const modelId = await loadModel({
    modelSrc: BERGAMOT_EN_FR,
    modelType: "nmt",
    modelConfig: {
        engine: "Bergamot",
        from: "en",
        to: "fr",
        beamsize: 1,
        temperature: 0.2
    }
});


const result = translate({
    modelId,
    text: "Good morning, how are you?",
    modelType: "nmt",
    stream: false
})

console.log(await result.text);
await unloadModel({ modelId });