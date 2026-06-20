import ai from "../config/gemini.js";
import {
    createPartFromUri,
    createUserContent,
} from "@google/genai";

export const analyzeResume = async (
    resumePath,
    jobDescription
) => {

    // Upload resume PDF
    const uploadedFile = await ai.files.upload({
        file: resumePath,
        config: {
            mimeType: "application/pdf",
        },
    });

    // Wait until Gemini finishes processing the file
    let fileInfo = await ai.files.get({
        name: uploadedFile.name,
    });

    while (fileInfo.state === "PROCESSING") {

        await new Promise((resolve) =>
            setTimeout(resolve, 2000)
        );

        fileInfo = await ai.files.get({
            name: uploadedFile.name,
        });

    }

    if (fileInfo.state === "FAILED") {

        throw new Error(
            "Gemini failed to process uploaded PDF."
        );

    }

    const prompt = `
You are an ATS Resume Analyzer.

First determine whether the uploaded document is actually a resume.

If it is NOT a resume, return EXACTLY:

{
    "isResume": false,
    "summary": "",
    "matchPercentage": 0,
    "missingSkills": [],
    "strengths": [],
    "suggestions": [
        "Please upload a valid resume."
    ]
}

If it IS a resume:

Compare it against the following Job Description.

=========================
${jobDescription}
=========================

Return ONLY JSON.

Return NO markdown.

Return NO explanation.

Return EXACTLY this schema:

{
    "isResume": true,
    "summary": "",
    "matchPercentage": 0,
    "missingSkills": [],
    "strengths": [],
    "suggestions": []
}
`;

    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: createUserContent([
            createPartFromUri(
                fileInfo.uri,
                fileInfo.mimeType
            ),
            prompt,
        ]),

        config: {
            responseMimeType: "application/json",
        },

    });

    // Delete uploaded Gemini file
    await ai.files.delete({
        name: fileInfo.name,
    });

    return JSON.parse(response.text);

};