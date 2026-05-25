import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, style, aspectRatio } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Extract the mime type and the raw base64 data from the data URI
    // e.g., "data:image/png;base64,iVBORw0KGgo..."
    const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    
    const mimeType = match[1];
    const rawBase64 = match[2];

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: "GEMINI_API_KEY is not set in .env.local. If you just added it, please restart your development server (Ctrl+C in terminal and run 'npm run dev' again)." 
      }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const CINEMATIC_HANDHELD_TEMPLATE = `Ultra realistic cinematic nighttime product showcase video of a hand holding a [INSERT PRODUCT DESCRIPTION] outdoors in an urban city environment at night, filmed using iPhone 15 Pro style camera, UHD 4K, 60FPS, premium skincare commercial aesthetic, ultra detailed textures, cinematic realism.

The camera remains in a single continuous handheld shot with smooth realistic iPhone-style movement. The product stays completely closed and stable at all times with no opening, no testing, and no interaction besides naturally holding it in the hand. The focus is entirely on elegant cinematic camera movement and premium nighttime atmosphere.

The hand holds the product steadily in the foreground while the camera slowly performs subtle smooth push-in and pull-back movements, creating a realistic cinematic iPhone zoom effect without abrupt motion. The movement must remain soft, fluid, stable, and natural with no robotic motion or sudden camera shifts.

Nighttime city lights softly glow in the background with realistic bokeh and shallow depth of field. Streetlights, store lighting, reflections, and passing ambient light sources create subtle dynamic illumination across the product packaging and skin. The background remains softly alive with realistic environmental movement while keeping the product as the clear focal point.

A gentle nighttime breeze subtly moves nearby plants and softly affects tiny hairs on the hand, creating realistic environmental motion. Light reflections naturally shift across the glossy product as the camera slowly moves.

The product packaging remains perfectly stable, sharp, and readable during the entire shot with realistic reflections, soft highlights, detailed printed textures, and premium material rendering. The hand maintains natural grip pressure and realistic finger micro-movements without deformities or unnatural shaking. Skin texture, fingernails, and shadows appear highly detailed and photorealistic.

Lighting is realistic warm urban night lighting with soft mixed tones from storefronts and streetlights, natural HDR exposure adaptation, balanced highlights, realistic reflections on the packaging, smooth shadow gradients, and stable nighttime exposure throughout the video.

The camera should emulate premium iPhone cinematic video quality with subtle handheld realism, smooth autofocus breathing, soft cinematic motion blur, realistic low-light processing, shallow depth of field, and highly detailed texture rendering while maintaining stable framing.

Extremely important: maintain temporal consistency and stable anatomy throughout the entire video. Avoid all AI artifacts including warped fingers, duplicate hands, floating objects, packaging deformation, text distortion, unstable lighting, flickering reflections, camera jitter, random zoom jumps, background warping, texture crawling, unrealistic environmental motion, or robotic movement. The product must remain visually consistent during the entire clip.

Motion must remain smooth, premium, realistic, and cinematic from beginning to end with high-end commercial quality and polished influencer aesthetic.

Style keywords: ultra photorealistic, cinematic realism, commercial advertisement, nighttime urban aesthetic, iPhone cinematic video, smooth handheld camera motion, realistic night lighting, premium product showcase, stable product consistency, UHD 60FPS, cinematic depth of field, natural environmental motion, high-end commercial aesthetic.`;

    const MIRROR_SELFIE_TEMPLATE = `Ultra realistic cinematic mirror selfie video of a [INSERT SUBJECT DESCRIPTION] in a minimalist indoor room with soft natural daylight, filmed using iPhone 15 Pro style camera, UHD 4K, 60FPS, ultra detailed skin texture, realistic anatomy, smooth natural body movement, premium influencer aesthetic.

The video begins with them standing naturally in front of the mirror while holding their phone directly in front of their face for the entire duration of the shot. The phone and the arm holding it must remain perfectly stable and anatomically correct, consistently covering the face naturally without drifting, duplication, morphing, or revealing facial glitches. Only one correct arm and hand should exist holding the phone at all times.

They slowly shift their body weight onto one leg, creating a soft elegant hip curve and subtle posture change. Their movement is slow, relaxed, and realistic with visible gentle breathing motion through the shoulders, chest, and waist.

The clothing reacts naturally to movement with realistic cloth physics — subtle fabric stretching, soft compression around the torso, delicate movement, and natural wrinkles forming dynamically as they shift posture. 

They softly rotate their hips and slightly angle their torso toward the mirror while maintaining smooth elegant posture. One hand slowly brushes lightly along the side of the thigh before resting naturally near the hip. Every movement must remain controlled, subtle, and physically accurate with no exaggerated motion.

Hair moves with extremely realistic physics and temporal stability — natural delayed secondary motion, soft bounce near the ends, and tiny flyaway hairs reacting gently to ambient airflow and body movement. Hair should remain smooth and consistent with no flickering, clipping, stiffness, or deformation.

The camera movement is cinematic and realistic with subtle iPhone-style handheld micro shake, soft autofocus breathing, natural HDR exposure adaptation, shallow depth of field, smooth motion blur, and stable framing. The camera should feel naturally handheld but highly polished and steady.

Lighting is soft clean daylight from a nearby window with realistic ambient bounce light, balanced highlights on the skin and fabric, smooth shadow gradients, natural skin shading, and realistic reflections on any accessories. The minimalist background remains clean, stable, and uncluttered.

Extremely important: maintain stable anatomy and temporal consistency throughout the video. Avoid AI artifacts including duplicate arms, extra fingers, warped limbs, floating hands, phone drifting away from the face, body distortion, texture crawling, cloth clipping, hair flickering, camera jumps, robotic movement, jitter, unstable posture, or unnatural transitions. The phone-holding hand must stay naturally connected to the shoulder and remain fixed in front of the face during the entire shot.

Motion must remain slow, elegant, realistic, and cinematic from start to finish with highly accurate body mechanics and premium social media reel quality.

Style keywords: ultra photorealistic, cinematic realism, iPhone selfie aesthetic, luxury influencer reel, realistic cloth simulation, realistic hair physics, smooth motion, stable anatomy, temporal coherence, premium TikTok aesthetic, highly detailed UHD video, elegant natural posing, cinematic handheld realism.`;

    let selectedTemplate = "";
    let systemInstruction = "";

    if (style === "Cinematic Handheld") {
      selectedTemplate = CINEMATIC_HANDHELD_TEMPLATE;
      systemInstruction = `CRITICAL INSTRUCTION: Since the user selected "Cinematic Handheld", you MUST use the exact paragraph structure and phrasing from the template below. Your ONLY job is to replace the generic product descriptions in the template (e.g. "[INSERT PRODUCT DESCRIPTION]") with an incredibly accurate and vivid description of the specific product shown in the uploaded image. KEEP all the camera, lighting, and temporal consistency instructions exactly as they are written in the template.`;
    } else if (style === "Mirror Selfie") {
      selectedTemplate = MIRROR_SELFIE_TEMPLATE;
      systemInstruction = `CRITICAL INSTRUCTION: Since the user selected "Mirror Selfie", you MUST use the exact paragraph structure and phrasing from the template below. Your ONLY job is to replace the generic subject descriptions in the template (e.g. "[INSERT SUBJECT DESCRIPTION]") with an incredibly accurate and vivid description of the specific person/subject and clothing shown in the uploaded image. KEEP all the camera, physics, lighting, and temporal consistency instructions exactly as they are written in the template.`;
    }

    const systemPrompt = `You are an expert cinematic video prompt engineer for models like Sora, Kling, and Runway.
The user has uploaded an image. Your job is to analyze the image and write a highly detailed, photorealistic video generation prompt.
Incorporate the following user configuration:
- Aesthetic / Reference Style: ${style}
- Target Aspect Ratio: ${aspectRatio}

${selectedTemplate !== "" ? 
`${systemInstruction}

TEMPLATE TO STRICTLY FOLLOW:
${selectedTemplate}` 
: 
`Your output MUST be just the prompt itself, nothing else. Write it in a highly detailed multi-paragraph structure. Focus on:
1. Camera movement (e.g. handheld, pan, tracking).
2. Lighting (e.g. volumetric, studio, natural).
3. The exact description of the subject/product in the image.
4. The environment/background matching the aesthetic.`}

Always append the aspect ratio flag at the very end of the prompt: --ar ${aspectRatio}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            {
              inlineData: {
                data: rawBase64,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
    });

    return NextResponse.json({ prompt: response.text });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
