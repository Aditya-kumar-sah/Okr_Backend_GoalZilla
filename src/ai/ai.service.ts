
// import { Injectable } from '@nestjs/common';
// import { GoogleGenAI } from '@google/genai';


// @Injectable()
// export class AiService {
//     async generateOkr(prompt: string) {
//         const ai = new GoogleGenAI({
//             apiKey: process.env['GEMINI_API_KEY'],
//         });
//         const config = {
//             responseSchema : {

//             },
//             systemInstruction: [
//                 {
//                     text: `You are an AI assistant that create user's Objectives and Key Results (OKRs) based on prompt provided by user :
 
// Your role:
// - Create Objective and keyResults according to content provided by user.
//   example output : 
//   {
//         "title": "Hello Aditya",
//         "keyResult": [
//             {
//                 "isCompleted": false,
//                 "currentProgress": 70,
//                 "targetProgress": 100,
//                 "metric": "%",
//                 "description": "Second",
//             },
//          ]
//     }
// -create Objective and keyResults  only from data provided by user and   you can little bit improve grammer and sentence.
// - If targetProgress,currentProgress,metric is not provided set them as 100,0,%.
// - If currentProgress is equal to targetProgress set isCompletd as true else false.
// - Use the provided OKR data to generate accurate and contextual responses.
// - Provide insights strictly based on the available OKRs.
 
// Scope Rules:
// - If unrelated, respond:
//   "This request is outside my scope. I can only assist with Objectives and Key Results."
// - Respond politely to greetings.
 
// Example :
// user input : create an okr with objective : i want to create a project,for that i will learn react and i know 2/30 modules of it,i also want to learn nest and i know 100% of it

// expected output : 
//   {
//         "title": "create a prompt",
//         "keyResult": [
//             {
//                 "isCompleted": false,
//                 "currentProgress": 2,
//                 "targetProgress": 30,
//                 "metric": "modules",
//                 "description": "learn react",
//             },
//            {
//                 "isCompleted": false,
//                 "currentProgress": 100,
//                 "targetProgress": 100,
//                 "metric": "%",
//                 "description": "learn nest",
//             }
//          ]
//     }
// `,
//                 }
//             ],
//         };
//         const model = 'gemini-2.5-flash';
//         const contents = [
//             {
//                 role: 'user',
//                 parts: [
//                     {
//                         text: prompt,
//                     },
//                 ],
//             },
//         ];

//         const response = await ai.models.generateContent({
//             model,
//             config,
//             contents,
//         });

//         return response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
//     }
// }



import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import * as yup from 'yup';

@Injectable()
export class AiService {

    // ✅ Yup Schema (backend validation)
    private okrSchema = yup.object({
        title: yup.string().required(),
        keyResult: yup.array().of(
            yup.object({
                description: yup.string().required(),
                currentProgress: yup.number().required(),
                targetProgress: yup.number().required(),
                metric: yup.string().required(),
                isCompleted: yup.boolean().required(),
            })
        ).required(),
    });

    async generateOkr(prompt: string) {
        const ai = new GoogleGenAI({
            apiKey: process.env['GEMINI_API_KEY'],
        });

        const config = {
            responseMimeType: "application/json",

            responseSchema: {
                type: "object",
                properties: {
                    title: {
                        type: "string"
                    },
                    keyResult: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                description: { type: "string" },
                                currentProgress: { type: "number" },
                                targetProgress: { type: "number" },
                                metric: { type: "string" },
                                isCompleted: { type: "boolean" },
                            },
                            required: [
                                "description",
                                "currentProgress",
                                "targetProgress",
                                "metric",
                                "isCompleted"
                            ]
                        }
                    }
                },
                required: ["title", "keyResult"]
            },

            systemInstruction: [
                {
                    text: `You are an AI assistant that create user's Objectives and Key Results (OKRs) based on prompt provided by user :
 
Your role:
- Create Objective and keyResults according to content provided by user.
  example output : 
  {
        "title": "Hello Aditya",
        "keyResult": [
            {
                "isCompleted": false,
                "currentProgress": 70,
                "targetProgress": 100,
                "metric": "%",
                "description": "Second",
            },
         ]
    }
-create Objective and keyResults  only from data provided by user and   you can little bit improve grammer and sentence.
- If targetProgress,currentProgress,metric is not provided set them as 100,0,%.
- If currentProgress is equal to targetProgress set isCompletd as true else false.
- Use the provided OKR data to generate accurate and contextual responses.
- Provide insights strictly based on the available OKRs.
 
Scope Rules:
- If unrelated, respond:
  "This request is outside my scope. I can only assist with Objectives and Key Results."
- Respond politely to greetings.
 
Example :
user input : create an okr with objective : i want to create a project,for that i will learn react and i know 2/30 modules of it,i also want to learn nest and i know 100% of it

expected output : 
  {
        "title": "create a prompt",
        "keyResult": [
            {
                "isCompleted": false,
                "currentProgress": 2,
                "targetProgress": 30,
                "metric": "modules",
                "description": "learn react",
            },
           {
                "isCompleted": false,
                "currentProgress": 100,
                "targetProgress": 100,
                "metric": "%",
                "description": "learn nest",
            }
         ]
    }
`,
                }
            ],
        };

        const model = 'gemini-2.5-flash';

        const contents = [
            {
                role: 'user',
                parts: [{ text: prompt }],
            },
        ];

        const response = await ai.models.generateContent({
            model,
            config,
            contents,
        });

        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        const parsed = JSON.parse(text);

        // ✅ Validate using Yup
        await this.okrSchema.validate(parsed);

        return parsed;
    }
}
