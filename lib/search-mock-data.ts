// lib/search-mock-data.ts
"use client"
import { SearchResult } from "@/types/search"

export const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    type: "Patent",
    title: "Quantum Error Correction Method Using Topological Qubits",
    snippet: "Novel approach to quantum error correction utilizing topological properties of matter for more stable quantum computing systems...",
    abstract: "This patent describes a revolutionary method for quantum error correction that leverages topological qubits. The system demonstrates 99.9% fidelity in maintaining quantum states over extended periods, significantly advancing the practical viability of quantum computers for commercial applications.",
    date: "2024-11-15",
    country: "United States",
    organization: "IBM Quantum Research",
    trl: 6,
    citations: 47,
    relevanceScore: 0.95,
    tags: ["Quantum Computing", "Error Correction", "Topological Qubits", "Hardware"],
    entities: ["IBM", "Quantum Computer", "Qubit", "Error Correction"],
    sourceUrl: "https://patents.google.com/patent/US123456789",
    matchedChunks: [
      "topological qubits provide inherent protection against local perturbations",
      "error correction rates improved by 300% compared to traditional methods"
    ]
  },
  {
    id: "2",
    type: "Paper",
    title: "CRISPR-Cas13 System for Precise RNA Editing in Mammalian Cells",
    snippet: "Breakthrough research demonstrating highly specific RNA editing capabilities with minimal off-target effects...",
    abstract: "We present a novel CRISPR-Cas13-based system that enables precise RNA editing in mammalian cells with unprecedented specificity. Our approach achieves 98% on-target efficiency while reducing off-target effects by 95% compared to existing methods.",
    date: "2024-10-28",
    country: "United Kingdom",
    organization: "Oxford University",
    trl: 4,
    citations: 89,
    relevanceScore: 0.92,
    tags: ["CRISPR", "Gene Editing", "RNA", "Biotechnology"],
    entities: ["CRISPR-Cas13", "RNA Editing", "Mammalian Cells"],
    sourceUrl: "https://nature.com/articles/example",
    matchedChunks: [
      "RNA editing precision reaches 98% with minimal off-target activity",
      "therapeutic potential for genetic diseases affecting RNA processing"
    ]
  },
  {
    id: "3",
    type: "Company",
    title: "QuantumLeap Technologies - Solid-State Quantum Computer Developer",
    snippet: "Series C funded startup developing room-temperature quantum computers using novel solid-state architecture...",
    abstract: "QuantumLeap Technologies is pioneering the development of solid-state quantum computers that operate at room temperature. Their proprietary architecture eliminates the need for expensive cryogenic cooling systems, potentially reducing the cost of quantum computing by 90%.",
    date: "2024-11-01",
    country: "United States",
    organization: "QuantumLeap Technologies",
    trl: 5,
    fundingAmount: 150,
    relevanceScore: 0.88,
    tags: ["Quantum Computing", "Startup", "Solid-State", "Room Temperature"],
    entities: ["QuantumLeap", "Series C", "Quantum Computer"],
    sourceUrl: "https://quantumleap.example.com",
    matchedChunks: [
      "room-temperature operation eliminates cryogenic requirements",
      "projected 10x cost reduction for quantum computing infrastructure"
    ]
  },
  {
    id: "4",
    type: "Patent",
    title: "Lithium-Sulfur Battery with Silicon Anode Architecture",
    snippet: "Advanced battery design achieving 500 Wh/kg energy density with extended cycle life...",
    abstract: "This invention describes a lithium-sulfur battery incorporating a novel silicon-based anode that achieves energy densities exceeding 500 Wh/kg while maintaining 80% capacity after 1000 cycles. The technology represents a significant breakthrough for electric vehicle applications.",
    date: "2024-09-20",
    country: "South Korea",
    organization: "Samsung Advanced Institute of Technology",
    trl: 7,
    citations: 34,
    relevanceScore: 0.85,
    tags: ["Energy Storage", "Battery", "Lithium-Sulfur", "Electric Vehicles"],
    entities: ["Lithium-Sulfur", "Silicon Anode", "Battery Technology"],
    sourceUrl: "https://patents.google.com/patent/KR123456789",
    matchedChunks: [
      "energy density exceeds 500 Wh/kg milestone for commercial viability",
      "cycle life extended to 1000+ cycles through novel silicon architecture"
    ]
  },
  {
    id: "5",
    type: "Report",
    title: "Global AI Investment Trends 2024: Focus on Generative AI",
    snippet: "Comprehensive analysis of AI investment patterns showing $150B in funding across 2,400 companies...",
    abstract: "This report analyzes global AI investment trends for 2024, revealing that generative AI companies captured 60% of all AI funding. The analysis covers investment patterns across regions, sectors, and technology categories, with projections through 2030.",
    date: "2024-11-10",
    country: "United States",
    organization: "McKinsey & Company",
    trl: 9,
    relevanceScore: 0.82,
    tags: ["Artificial Intelligence", "Investment", "Market Analysis", "Generative AI"],
    entities: ["AI Investment", "Generative AI", "Market Trends"],
    sourceUrl: "https://mckinsey.com/reports/ai-investment-2024",
    matchedChunks: [
      "generative AI dominates funding landscape with $90B invested",
      "enterprise AI adoption accelerating across all major sectors"
    ]
  },
  {
    id: "6",
    type: "Paper",
    title: "Room-Temperature Superconductor: LK-99 Material Validation Study",
    snippet: "Independent validation of room-temperature superconducting properties in modified LK-99 material...",
    abstract: "We present independent verification of room-temperature superconductivity in a modified LK-99 compound. Our experiments demonstrate zero resistance and perfect diamagnetism at 293K and ambient pressure, confirming the revolutionary potential of this material class.",
    date: "2024-08-15",
    country: "Germany",
    organization: "Max Planck Institute",
    trl: 3,
    citations: 234,
    relevanceScore: 0.90,
    tags: ["Superconductivity", "Materials Science", "Room Temperature", "Physics"],
    entities: ["LK-99", "Superconductor", "Ambient Pressure"],
    sourceUrl: "https://science.org/doi/example",
    matchedChunks: [
      "zero electrical resistance confirmed at room temperature",
      "meissner effect observed consistently across multiple samples"
    ]
  }
]