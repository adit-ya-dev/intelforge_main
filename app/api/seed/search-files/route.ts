// app/api/seed/search-files/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Sample technology data
const sampleTechnologyData = [
  {
    type: 'Patent',
    title: 'Quantum Error Correction Method Using Topological Qubits',
    snippet: 'Novel approach to quantum error correction utilizing topological properties of matter for more stable quantum computing systems...',
    abstract: 'This patent describes a revolutionary method for quantum error correction that leverages topological qubits. The system demonstrates 99.9% fidelity in maintaining quantum states over extended periods.',
    date: '2024-11-15',
    country: 'United States',
    organization: 'IBM Quantum Research',
    trl: 6,
    citations: 47,
    domain: 'Quantum Computing',
    tags: ['Quantum Computing', 'Error Correction', 'Topological Qubits'],
    entities: ['IBM', 'Quantum Computer', 'Qubit'],
  },
  {
    type: 'Paper',
    title: 'CRISPR-Cas13 System for Precise RNA Editing in Mammalian Cells',
    snippet: 'Breakthrough research demonstrating highly specific RNA editing capabilities with minimal off-target effects...',
    abstract: 'We present a novel CRISPR-Cas13-based system that enables precise RNA editing in mammalian cells with unprecedented specificity.',
    date: '2024-10-28',
    country: 'United Kingdom',
    organization: 'Oxford University',
    trl: 4,
    citations: 89,
    domain: 'Biotechnology',
    tags: ['CRISPR', 'Gene Editing', 'RNA', 'Biotechnology'],
    entities: ['CRISPR-Cas13', 'RNA Editing'],
  },
  {
    type: 'Company',
    title: 'QuantumLeap Technologies - Solid-State Quantum Computer Developer',
    snippet: 'Series C funded startup developing room-temperature quantum computers using novel solid-state architecture...',
    abstract: 'QuantumLeap Technologies is pioneering the development of solid-state quantum computers that operate at room temperature.',
    date: '2024-11-01',
    country: 'United States',
    organization: 'QuantumLeap Technologies',
    trl: 5,
    funding_amount: 150,
    domain: 'Quantum Computing',
    tags: ['Quantum Computing', 'Startup', 'Solid-State'],
    entities: ['QuantumLeap', 'Series C'],
  },
  {
    type: 'Patent',
    title: 'Lithium-Sulfur Battery with Silicon Anode Architecture',
    snippet: 'Advanced battery design achieving 500 Wh/kg energy density with extended cycle life...',
    abstract: 'This invention describes a lithium-sulfur battery incorporating a novel silicon-based anode that achieves energy densities exceeding 500 Wh/kg.',
    date: '2024-09-20',
    country: 'South Korea',
    organization: 'Samsung Advanced Institute of Technology',
    trl: 7,
    citations: 34,
    domain: 'Energy Storage',
    tags: ['Energy Storage', 'Battery', 'Lithium-Sulfur'],
    entities: ['Lithium-Sulfur', 'Silicon Anode'],
  },
  {
    type: 'Report',
    title: 'Global AI Investment Trends 2024: Focus on Generative AI',
    snippet: 'Comprehensive analysis of AI investment patterns showing $150B in funding across 2,400 companies...',
    abstract: 'This report analyzes global AI investment trends for 2024, revealing that generative AI companies captured 60% of all AI funding.',
    date: '2024-11-10',
    country: 'United States',
    organization: 'McKinsey & Company',
    trl: 9,
    domain: 'Artificial Intelligence',
    tags: ['AI', 'Investment', 'Market Analysis'],
    entities: ['AI Investment', 'Generative AI'],
  },
  {
    type: 'Paper',
    title: 'Room-Temperature Superconductor: LK-99 Material Validation Study',
    snippet: 'Independent validation of room-temperature superconducting properties in modified LK-99 material...',
    abstract: 'We present independent verification of room-temperature superconductivity in a modified LK-99 compound.',
    date: '2024-08-15',
    country: 'Germany',
    organization: 'Max Planck Institute',
    trl: 3,
    citations: 234,
    domain: 'Advanced Materials',
    tags: ['Superconductivity', 'Materials Science', 'Physics'],
    entities: ['LK-99', 'Superconductor'],
  },
];

// Sample search suggestions
const sampleSearchSuggestions = [
  { suggestion: 'Quantum computing breakthroughs', type: 'trending', popularity: 150 },
  { suggestion: 'CRISPR gene editing patents', type: 'trending', popularity: 120 },
  { suggestion: 'Solid-state battery technology', type: 'trending', popularity: 95 },
  { suggestion: 'AI machine learning advances', type: 'trending', popularity: 180 },
  { suggestion: 'Renewable energy innovations', type: 'trending', popularity: 110 },
  { suggestion: 'Nanotechnology applications', type: 'user_generated', popularity: 65 },
  { suggestion: '5G telecommunications', type: 'user_generated', popularity: 88 },
  { suggestion: 'Blockchain distributed ledger', type: 'user_generated', popularity: 72 },
];

// POST - Seed database with sample data
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type = 'all' } = body

    const results: any = {
      technologyData: 0,
      searchSuggestions: 0,
      errors: [],
    }

    // Seed technology data
    if (type === 'all' || type === 'technology') {
      try {
        const { data, error } = await supabase
          .from('technology_data')
          .insert(sampleTechnologyData)
          .select()

        if (error) {
          results.errors.push(`Technology data: ${error.message}`)
        } else {
          results.technologyData = data?.length || 0
        }
      } catch (error) {
        results.errors.push(`Technology data exception: ${error}`)
      }
    }

    // Seed search suggestions
    if (type === 'all' || type === 'suggestions') {
      try {
        const { data, error } = await supabase
          .from('search_suggestions')
          .insert(sampleSearchSuggestions)
          .select()

        if (error) {
          results.errors.push(`Search suggestions: ${error.message}`)
        } else {
          results.searchSuggestions = data?.length || 0
        }
      } catch (error) {
        results.errors.push(`Search suggestions exception: ${error}`)
      }
    }

    // Create sample collection for user
    if (type === 'all' || type === 'collections') {
      try {
        const { data, error } = await supabase
          .from('file_collections')
          .insert([
            {
              user_id: user.id,
              name: 'Research Papers',
              description: 'Academic research and scientific papers',
              color: '#3b82f6',
            },
            {
              user_id: user.id,
              name: 'Patents',
              description: 'Patent documents and filings',
              color: '#10b981',
            },
            {
              user_id: user.id,
              name: 'Reports',
              description: 'Market analysis and technical reports',
              color: '#f59e0b',
            },
          ])
          .select()

        if (error) {
          results.errors.push(`Collections: ${error.message}`)
        } else {
          results.collections = data?.length || 0
        }
      } catch (error) {
        results.errors.push(`Collections exception: ${error}`)
      }
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      results,
    })
  } catch (error) {
    console.error('Seed API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Clear seed data
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results: any = {
      deleted: {
        searchHistory: 0,
        savedSearches: 0,
        files: 0,
        collections: 0,
        shares: 0,
      },
      errors: [],
    }

    // Clear user's search history
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id)
      
      if (error) results.errors.push(`Search history: ${error.message}`)
    } catch (error) {
      results.errors.push(`Search history exception: ${error}`)
    }

    // Clear user's saved searches
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('user_id', user.id)
      
      if (error) results.errors.push(`Saved searches: ${error.message}`)
    } catch (error) {
      results.errors.push(`Saved searches exception: ${error}`)
    }

    // Clear user's file shares
    try {
      const { error } = await supabase
        .from('file_shares')
        .delete()
        .eq('user_id', user.id)
      
      if (error) results.errors.push(`File shares: ${error.message}`)
    } catch (error) {
      results.errors.push(`File shares exception: ${error}`)
    }

    // Clear user's files
    try {
      const { error } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('user_id', user.id)
      
      if (error) results.errors.push(`Files: ${error.message}`)
    } catch (error) {
      results.errors.push(`Files exception: ${error}`)
    }

    // Clear user's collections
    try {
      const { error } = await supabase
        .from('file_collections')
        .delete()
        .eq('user_id', user.id)
      
      if (error) results.errors.push(`Collections: ${error.message}`)
    } catch (error) {
      results.errors.push(`Collections exception: ${error}`)
    }

    return NextResponse.json({
      message: 'User data cleared successfully',
      results,
    })
  } catch (error) {
    console.error('Clear data API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}