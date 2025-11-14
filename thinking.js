import { ChatOpenAI, DallEAPIWrapper } from '@langchain/openai';
import { config } from './config.js';
import { z } from 'https://esm.sh/zod@4.1.12';



const bookSchema = z.object({
  explanation: z.string().describe("A short explanation of what the object is using slang from 150 years in the future"),
  useCase: z.string().describe("a brief and fun description of how the object is used, filled with imaginary words from the future"),
  danger: z.string().describe("describe the dangers of this of this object's existence on a human individual"),
  dangerExtreme: z.string().describe("Describe how this destroyed the world through collective consciousness, geopolitics, climate change or war")
});

const model = new ChatOpenAI({
    apiKey: config.OPENAI_API_KEY,
    temperature: 1.5,
    maxTokens: 2000
});

const dalleTool = new DallEAPIWrapper({
    n: 1,
    model: "dall-e-3",
    apiKey: config.OPENAI_API_KEY,
    size: "1024x1024"
    // Removed response_format and style
});


const modelWithStructure = model.withStructuredOutput(bookSchema);


window.getObjDesc = async function(input){

window.obj = input;
console.log(window.obj);

const structuredOutput = await modelWithStructure.invoke(
    //userInput();
    `What is this ${input}`
); // Model with Structure Method


const picPrompts = [
  `a cartoon Black line cartoon on a solid green background of ${input}`,
  `a cartoon Black line cartoon on a solid green background of a stickperson person using the ${input}`,
  `a cartoon Black line cartoon on a solid green background of the ${input} conquering the earth`,
  `a cartoon Black line cartoon on a solid green background of the world on fire, with the ${input} in the middle`
];

const picOutputs = await Promise.all(picPrompts.map(p => dalleTool.invoke(p)));


console.log('structuredOutput (raw):', structuredOutput);
console.log('picOutputs (raw):', picOutputs);

// normalize to an array of URLs (adapt if your wrapper returns b64_json)
window.pImages = picOutputs.map(out => {
  // many wrappers return an object with data array: [{url: "..."}]
  if (out?.data && Array.isArray(out.data)) {
    return out.data.map(d => d.url ?? d.b64_json ?? d);
  }
  // fallback: if wrapper returned a string or array
  if (Array.isArray(out)) return out;
  return out;
}).flat();



// keep structured text fields from the structuredOutput only
window.danger = structuredOutput.danger;
window.explanation = structuredOutput.explanation;
window.useCase = structuredOutput.useCase;
window.dangerExtreme = structuredOutput.dangerExtreme;
writingArray = [window.explanation, window.useCase, window.danger, window.dangerExtreme];

console.log(window.danger, window.explanation, window.useCase, window.dangerExtreme);
console.log('pImages:', window.pImages);
}