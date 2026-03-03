import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateShipmentSummary(shipmentData: any) {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      As a logistics expert, provide a concise, professional summary and risk assessment for the following shipment:
      
      Shipment ID: ${shipmentData.id}
      Status: ${shipmentData.status}
      Sender: ${shipmentData.sender_name} (${shipmentData.sender_city}, ${shipmentData.sender_country})
      Receiver: ${shipmentData.receiver_name} (${shipmentData.receiver_city}, ${shipmentData.receiver_country})
      Type: ${shipmentData.type}
      Weight: ${shipmentData.weight}kg
      Estimated Delivery: ${shipmentData.est_delivery}
      
      Tracking History:
      ${shipmentData.updates?.map((u: any) => `- ${u.timestamp}: ${u.status} in ${u.location}. Notes: ${u.notes}`).join('\n')}
      
      Customs Documents:
      ${shipmentData.docs?.map((d: any) => `- ${d.doc_type}: ${d.status}`).join('\n')}
      
      Please include:
      1. A 2-sentence summary of the current situation.
      2. Any potential risks (customs, delays, etc.).
      3. Recommended next steps for the dispatcher.
      
      Format the output in clean Markdown.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI summary");
  }
}
