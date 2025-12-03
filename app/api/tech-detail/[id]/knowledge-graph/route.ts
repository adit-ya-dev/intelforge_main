// app/api/tech-detail/[id]/knowledge-graph/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Retrieve knowledge graph data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Get nodes
    const { data: nodes, error: nodesError } = await supabase
      .from('kg_nodes')
      .select('*')
      .eq('technology_id', id)

    if (nodesError) {
      console.error('Error fetching KG nodes:', nodesError)
      return NextResponse.json(
        { error: 'Failed to fetch knowledge graph nodes' },
        { status: 500 }
      )
    }

    // Get edges
    const { data: edges, error: edgesError } = await supabase
      .from('kg_edges')
      .select('*')
      .eq('technology_id', id)

    if (edgesError) {
      console.error('Error fetching KG edges:', edgesError)
      return NextResponse.json(
        { error: 'Failed to fetch knowledge graph edges' },
        { status: 500 }
      )
    }

    // Format nodes
    const formattedNodes = (nodes || []).map((node: any) => ({
      id: node.node_id,
      type: node.node_type,
      label: node.label,
      description: node.description,
      size: node.size,
      color: node.color,
      metadata: node.metadata,
    }))

    // Format edges
    const formattedEdges = (edges || []).map((edge: any) => ({
      source: edge.source_node_id,
      target: edge.target_node_id,
      type: edge.edge_type,
      weight: parseFloat(edge.weight),
      label: edge.label,
    }))

    // Find center node (the technology itself)
    const centerNode = formattedNodes.find((n: any) => n.type === 'technology')
    const centerNodeId = centerNode?.id || (formattedNodes[0]?.id || id)

    return NextResponse.json({
      techId: id,
      graph: {
        nodes: formattedNodes,
        edges: formattedEdges,
        centerNodeId,
      },
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Knowledge graph API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}