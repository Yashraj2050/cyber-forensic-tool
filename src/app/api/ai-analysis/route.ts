import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    switch (type) {
      case 'stylometry':
        return await analyzeStylometry(zai, data)
      case 'entity_extraction':
        return await extractEntities(zai, data)
      case 'risk_assessment':
        return await assessRisk(zai, data)
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in AI analysis:', error)
    return NextResponse.json(
      { error: 'Failed to perform AI analysis' },
      { status: 500 }
    )
  }
}

async function analyzeStylometry(zai: any, data: { texts: string[] }) {
  try {
    const prompt = `
    Analyze the writing style of these texts and provide a stylometry analysis. 
    For each text, identify:
    1. Average sentence length
    2. Vocabulary richness (unique words vs total words)
    3. Punctuation patterns
    4. Common phrases or expressions
    5. Writing complexity level
    
    Then compare all texts and provide a similarity score (0-100%) indicating if they might be written by the same author.
    
    Texts:
    ${data.texts.map((text, index) => `Text ${index + 1}: ${text}`).join('\n\n')}
    
    Provide the analysis in JSON format with the following structure:
    {
      "individual_analysis": [
        {
          "text_index": 1,
          "avg_sentence_length": number,
          "vocabulary_richness": number,
          "punctuation_patterns": string,
          "common_phrases": string[],
          "complexity_level": string
        }
      ],
      "similarity_analysis": {
        "overall_similarity": number,
        "confidence": number,
        "likely_same_author": boolean,
        "key_differences": string[],
        "key_similarities": string[]
      }
    }
    `

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert in forensic stylometry analysis. Provide detailed, accurate analysis of writing styles and authorship attribution.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from AI')
    }

    try {
      const parsedResult = JSON.parse(result)
      return NextResponse.json(parsedResult)
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      return NextResponse.json({
        analysis: result,
        note: 'AI response was not in valid JSON format'
      })
    }
  } catch (error) {
    console.error('Error in stylometry analysis:', error)
    return NextResponse.json(
      { error: 'Failed to perform stylometry analysis' },
      { status: 500 }
    )
  }
}

async function extractEntities(zai: any, data: { text: string }) {
  try {
    const prompt = `
    Extract and identify all entities from the following text. Look for:
    1. Usernames or aliases
    2. Email addresses
    3. Cryptocurrency wallet addresses (BTC, ETH, etc.)
    4. Phone numbers
    5. Website URLs (especially .onion addresses)
    6. Any other identifiable entities
    
    Text: "${data.text}"
    
    Provide the extraction in JSON format with the following structure:
    {
      "entities": [
        {
          "type": "username|email|wallet|phone|url|other",
          "value": "extracted_value",
          "confidence": number_between_0_and_1,
          "context": "surrounding_text_context"
        }
      ],
      "summary": {
        "total_entities": number,
        "entity_types": {
          "username": number,
          "email": number,
          "wallet": number,
          "phone": number,
          "url": number,
          "other": number
        }
      }
    }
    `

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert in entity extraction for cyber forensic analysis. Identify and extract all potential entities from text with high accuracy.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from AI')
    }

    try {
      const parsedResult = JSON.parse(result)
      return NextResponse.json(parsedResult)
    } catch (parseError) {
      return NextResponse.json({
        analysis: result,
        note: 'AI response was not in valid JSON format'
      })
    }
  } catch (error) {
    console.error('Error in entity extraction:', error)
    return NextResponse.json(
      { error: 'Failed to perform entity extraction' },
      { status: 500 }
    )
  }
}

async function assessRisk(zai: any, data: { entity: any, context: string }) {
  try {
    const prompt = `
    Assess the risk level of the following entity based on the provided information. 
    Consider factors such as:
    1. Association with known malicious activities
    2. Suspicious behavior patterns
    3. High-risk connections
    4. Engagement in illegal activities
    5. Technical sophistication
    
    Entity Data:
    ${JSON.stringify(data.entity, null, 2)}
    
    Context: ${data.context}
    
    Provide a risk assessment in JSON format with the following structure:
    {
      "risk_level": number_between_1_and_5,
      "confidence": number_between_0_and_1,
      "is_malicious": boolean,
      "risk_factors": [
        {
          "factor": "description_of_risk_factor",
          "severity": "low|medium|high|critical",
          "evidence": "supporting_evidence"
        }
      ],
      "recommendations": [
        "actionable_recommendation"
      ],
      "threat_actors": [
        {
          "type": "individual|group|organization",
          "motivation": "financial|espionage|sabotage|other",
          "capability": "low|medium|high"
        }
      ]
    }
    `

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert in cyber threat intelligence and risk assessment. Provide detailed, accurate risk assessments based on available data.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from AI')
    }

    try {
      const parsedResult = JSON.parse(result)
      return NextResponse.json(parsedResult)
    } catch (parseError) {
      return NextResponse.json({
        analysis: result,
        note: 'AI response was not in valid JSON format'
      })
    }
  } catch (error) {
    console.error('Error in risk assessment:', error)
    return NextResponse.json(
      { error: 'Failed to perform risk assessment' },
      { status: 500 }
    )
  }
}