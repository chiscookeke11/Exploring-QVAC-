import { loadModel, transcribe, unloadModel, WHISPER_TINY } from "@qvac/sdk";




const modelId = await loadModel({
    modelSrc: WHISPER_TINY,
    modelType: "whisper"
})

const text = await transcribe({
    modelId,
    audioChunk: "./audio_files/test_audio.mp4"
})

console.log(text)

await unloadModel({ modelId })

