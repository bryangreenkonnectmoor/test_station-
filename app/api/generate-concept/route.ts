import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { audience, parentConcept } = await request.json()

    let prompt = ''
    
    if (parentConcept) {
      prompt = `You are a creative marketing strategist. Based on the following audience and previous concept, generate a new marketing concept that remixes elements from the previous one with fresh ideas.

Audience:
- Name: ${audience.name}
- Age Range: ${audience.age_range}
- Gender: ${audience.gender}
- Location: ${audience.location}
- Interests: ${audience.interests.join(', ')}
- Income Level: ${audience.income_level}

Previous Concept to Remix:
Title: ${parentConcept.title}
Description: ${parentConcept.description}

Generate a new marketing concept that builds upon or remixes the previous concept. Return ONLY a JSON object with this exact structure:
{
  "title": "Compelling concept title",
  "description": "Detailed concept description (2-3 sentences)"
}`
    } else {
      prompt = `You are a creative marketing strategist. Based on the following audience demographics, generate an innovative marketing concept.

Audience:
- Name: ${audience.name}
- Age Range: ${audience.age_range}
- Gender: ${audience.gender}
- Location: ${audience.location}
- Interests: ${audience.interests.join(', ')}
- Income Level: ${audience.income_level}

Generate a creative marketing concept tailored to this audience. Return ONLY a JSON object with this exact structure:
{
  "title": "Compelling concept title",
  "description": "Detailed concept description (2-3 sentences)"
}`
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content returned from OpenAI')
    }

    const concept = JSON.parse(content)

    return NextResponse.json(concept)
  } catch (error) {
    console.error('Error generating concept:', error)
    return NextResponse.json(
      { error: 'Failed to generate concept' },
      { status: 500 }
    )
  }
}
