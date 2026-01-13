// types/search-files.ts
// IntelForge Search & Files Module - TypeScript Type Definitions

// ============================================
// SEARCH TYPES
// ============================================




export type SearchType = 'Patent' | 'Paper' | 'Company' | 'Report' | 'News'
export type SearchMode = 'semantic' | 'keyword'
export type SortOption = 'relevance' | 'date' | 'trl' | 'citations'
export type AlertFrequency = 'none' | 'daily' | 'weekly' | 'monthly'

export interface SearchResult {
  id: string
  type: SearchType
  title: string
  snippet: string
  abstract?: string
  date?: string
  country?: string
  organization?: string
  trl?: number
  citations?: number
  fundingAmount?: number
  relevanceScore: number
  tags?: string[]
  entities?: string[]
  domain?: string
  sourceUrl?: string
  matchedChunks?: string[]
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export interface SearchFilters {
  domain?: string[]
  trl?: string[]
  dateRange?: {
    from?: string | Date | null
    to?: string | Date | null
  }
  country?: string[]
  sourceType?: string[]
  organization?: string[]
  fundingRange?: {
    min?: number | null
    max?: number | null
  }
  confidence?: [number, number]
}

export interface SearchParams {
  query: string
  semantic?: boolean
  filters?: SearchFilters
  page?: number
  size?: number
  sortBy?: SortOption
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  size: number
  totalPages: number
  hasMore: boolean
}

export interface SearchHistoryItem {
  id: string
  userId: string
  query: string
  searchMode: SearchMode
  filters: SearchFilters
  resultCount: number
  createdAt: string
}

export interface SavedSearch {
  id: string
  userId: string
  name: string
  query: string
  searchMode: SearchMode
  filters: SearchFilters
  alertFrequency: AlertFrequency
  isActive: boolean
  lastRunAt?: string
  createdAt: string
  updatedAt: string
}

export interface SearchSuggestion {
  id: string
  suggestion: string
  type: 'trending' | 'user_generated' | 'system'
  popularity: number
  category?: string
  createdAt: string
  updatedAt: string
}

// ============================================
// FILE MANAGEMENT TYPES
// ============================================

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type FileCategory = 'document' | 'image' | 'spreadsheet' | 'other'

export interface UploadedFile {
  id: string
  userId: string
  fileName: string
  fileType: string
  fileSize: number
  storagePath: string
  publicUrl?: string
  collectionId?: string
  description?: string
  processingStatus: ProcessingStatus
  processedAt?: string
  errorMessage?: string
  metadata?: Record<string, any>
  downloadCount: number
  lastDownloadedAt?: string
  createdAt: string
  updatedAt: string
}

export interface FileUploadRequest {
  file: File
  collectionId?: string
  description?: string
}

export interface FileListParams {
  collectionId?: string
  type?: string
  search?: string
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FileListResponse {
  files: UploadedFile[]
  total: number
  limit: number
  offset: number
  stats: FileStats
}

export interface FileStats {
  totalFiles: number
  totalSize: number
  typeCounts: Record<string, number>
}

export interface FileCollection {
  id: string
  userId: string
  name: string
  description?: string
  color: string
  createdAt: string
  updatedAt: string
}

export interface FileShare {
  id: string
  fileId: string
  userId: string
  shareToken: string
  shareUrl?: string
  expiresAt: string
  allowDownload: boolean
  password?: string
  accessCount: number
  lastAccessedAt?: string
  createdAt: string
  isExpired?: boolean
}

export interface CreateShareRequest {
  file_id: string
  expires_in_days?: number
  allow_download?: boolean
  password?: string
}

export interface DownloadResponse {
  downloadUrl: string
  file: {
    id: string
    name: string
    type: string
    size: number
  }
}

export interface FileStatusResponse {
  file: {
    id: string
    fileName: string
    processingStatus: ProcessingStatus
    processedAt?: string
    errorMessage?: string
    metadata?: Record<string, any>
  }
  status: ProcessingStatus
  processedAt?: string
  error?: string
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  message?: string
  data?: T
  error?: string
  details?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  hasMore?: boolean
}

// ============================================
// SEED DATA TYPES
// ============================================

export interface SeedDataRequest {
  type?: 'all' | 'technology' | 'suggestions' | 'collections'
}

export interface SeedDataResponse {
  message: string
  results: {
    technologyData?: number
    searchSuggestions?: number
    collections?: number
    errors?: string[]
  }
}

// ============================================
// UTILITY TYPES
// ============================================

export interface DateRange {
  from?: string | Date | null
  to?: string | Date | null
}

export interface NumberRange {
  min?: number | null
  max?: number | null
}

export type ViewMode = 'list' | 'map' | 'grid'

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface SearchBarProps {
  query: string
  setQuery: (query: string) => void
  searchMode: SearchMode
  setSearchMode: (mode: SearchMode) => void
  onSearch: (query: string) => void
  isLoading: boolean
}

export interface FilterPanelProps {
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  onApply: () => void
}

export interface ResultsListProps {
  results: SearchResult[]
  sortBy: string
  setSortBy: (sort: string) => void
  onSelectResult: (result: SearchResult) => void
  isLoading: boolean
  onLoadMore: () => void
  hasMore: boolean
  searchMode: SearchMode
}

export interface ResultCardProps {
  result: SearchResult
  onClick: () => void
}

export interface PreviewDrawerProps {
  result: SearchResult | null
  onClose: () => void
}

export interface MapViewProps {
  results: SearchResult[]
}

export interface SearchHeaderProps {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  onSaveQuery: () => void
}

// ============================================
// FORM TYPES
// ============================================

export interface SavedSearchFormData {
  name: string
  query: string
  searchMode: SearchMode
  filters: SearchFilters
  alertFrequency: AlertFrequency
}

export interface FileCollectionFormData {
  name: string
  description?: string
  color: string
}

export interface ShareFormData {
  fileId: string
  expiresInDays: number
  allowDownload: boolean
  password?: string
}

// ============================================
// CONSTANTS
// ============================================

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.ms-excel',
  'text/csv',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const DOMAINS = [
  'Quantum Computing',
  'Artificial Intelligence',
  'Biotechnology',
  'Energy Storage',
  'Advanced Materials',
  'Space Technology',
] as const

export const TRL_LEVELS = [
  'TRL 1-3 (Basic Research)',
  'TRL 4-6 (Development)',
  'TRL 7-9 (Deployment)',
] as const

export const COUNTRIES = [
  'United States',
  'China',
  'Germany',
  'Japan',
  'United Kingdom',
  'South Korea',
  'India',
] as const

export const SOURCE_TYPES: SearchType[] = [
  'Patent',
  'Paper',
  'Company',
  'Report',
  'News',
] as const
