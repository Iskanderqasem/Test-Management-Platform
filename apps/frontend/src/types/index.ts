// ============================================================
// Core Entity Types for Test Management Platform
// ============================================================

export type ID = string

export type UserRole =
  | 'admin'
  | 'project_manager'
  | 'test_lead'
  | 'tester'
  | 'developer'
  | 'viewer'

export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type Status = 'active' | 'inactive' | 'archived' | 'draft'

// ============================================================
// User & Auth
// ============================================================

export interface User {
  id: ID
  email: string
  name: string
  avatar?: string
  role: UserRole
  department?: string
  timezone?: string
  preferences: UserPreferences
  createdAt: string
  lastLoginAt?: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  emailDigest: 'daily' | 'weekly' | 'never'
  defaultProject?: ID
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

// ============================================================
// Project
// ============================================================

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
export type ProjectType = 'web' | 'mobile' | 'api' | 'desktop' | 'embedded' | 'hybrid'

export interface Project {
  id: ID
  name: string
  code: string
  description: string
  type: ProjectType
  status: ProjectStatus
  priority: Priority
  startDate: string
  endDate?: string
  owner: User
  team: TeamMember[]
  stats: ProjectStats
  tags: string[]
  integrations: ProjectIntegration[]
  createdAt: string
  updatedAt: string
}

export interface ProjectStats {
  totalRequirements: number
  totalTestCases: number
  totalDefects: number
  openDefects: number
  testCoverage: number
  passRate: number
  executionProgress: number
  activeReleases: number
}

export interface TeamMember {
  user: User
  role: UserRole
  joinedAt: string
}

export interface ProjectIntegration {
  type: 'jira' | 'azure_devops' | 'github' | 'gitlab' | 'confluence'
  enabled: boolean
  config: Record<string, string>
}

// ============================================================
// Release & Sprint
// ============================================================

export interface Release {
  id: ID
  projectId: ID
  name: string
  version: string
  description?: string
  status: 'planned' | 'in_progress' | 'released' | 'cancelled'
  startDate: string
  releaseDate?: string
  sprints: Sprint[]
  stats: {
    totalTestCases: number
    passed: number
    failed: number
    blocked: number
    notExecuted: number
  }
  createdAt: string
}

export interface Sprint {
  id: ID
  releaseId: ID
  name: string
  goal?: string
  status: 'planned' | 'active' | 'completed'
  startDate: string
  endDate: string
  velocity?: number
  createdAt: string
}

export interface ChangeRequest {
  id: ID
  projectId: ID
  title: string
  description: string
  status: 'draft' | 'under_review' | 'approved' | 'rejected' | 'implemented'
  priority: Priority
  requestedBy: User
  impactedAreas: string[]
  linkedRequirements: ID[]
  linkedTestCases: ID[]
  createdAt: string
}

// ============================================================
// Requirements
// ============================================================

export type RequirementType =
  | 'functional'
  | 'non_functional'
  | 'security'
  | 'performance'
  | 'ui_ux'
  | 'integration'
  | 'compliance'
  | 'business'

export type RequirementStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'implemented'
  | 'deprecated'

export interface Requirement {
  id: ID
  projectId: ID
  code: string
  title: string
  description: string
  type: RequirementType
  status: RequirementStatus
  priority: Priority
  acceptanceCriteria: AcceptanceCriteria[]
  source: RequirementSource
  linkedTestCases: ID[]
  linkedDefects: ID[]
  coverage: number
  aiAnalysis?: RequirementAnalysis
  version: number
  tags: string[]
  createdBy: User
  createdAt: string
  updatedAt: string
}

export interface AcceptanceCriteria {
  id: ID
  description: string
  testable: boolean
  covered: boolean
}

export interface RequirementSource {
  type: 'document' | 'url' | 'manual' | 'import'
  fileName?: string
  url?: string
  uploadedAt?: string
}

export interface RequirementAnalysis {
  completeness: number
  clarity: number
  testability: number
  issues: AnalysisIssue[]
  suggestions: string[]
  analyzedAt: string
}

export interface AnalysisIssue {
  type: 'missing_ac' | 'ambiguous' | 'conflict' | 'duplicate' | 'gap'
  severity: 'high' | 'medium' | 'low'
  description: string
  suggestion?: string
}

export interface GapAnalysisResult {
  projectId: ID
  analyzedAt: string
  overallScore: number
  missingRequirements: GapItem[]
  conflicts: ConflictItem[]
  missingAcceptanceCriteria: MissingACItem[]
  securityRisks: RiskItem[]
  performanceRisks: RiskItem[]
  questions: string[]
  summary: string
}

export interface GapItem {
  id: ID
  area: string
  description: string
  severity: Priority
  suggestedRequirement?: string
}

export interface ConflictItem {
  id: ID
  requirement1: Requirement
  requirement2: Requirement
  conflictType: string
  description: string
  resolution?: string
}

export interface MissingACItem {
  requirementId: ID
  requirementTitle: string
  missingCriteria: string[]
  suggestions: string[]
}

export interface RiskItem {
  id: ID
  title: string
  description: string
  severity: Priority
  affectedAreas: string[]
  mitigation?: string
}

// ============================================================
// Test Cases
// ============================================================

export type TestCaseType =
  | 'functional'
  | 'regression'
  | 'smoke'
  | 'integration'
  | 'performance'
  | 'security'
  | 'usability'
  | 'exploratory'
  | 'api'
  | 'ui'

export type TestCaseStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'deprecated'
  | 'automated'

export type ExecutionResult = 'pass' | 'fail' | 'blocked' | 'skip' | 'not_executed'

export interface TestCase {
  id: ID
  projectId: ID
  code: string
  title: string
  description?: string
  type: TestCaseType
  status: TestCaseStatus
  priority: Priority
  preconditions?: string
  steps: TestStep[]
  expectedResult: string
  linkedRequirements: ID[]
  linkedDefects: ID[]
  tags: string[]
  automationStatus: 'manual' | 'automated' | 'in_progress'
  automationScript?: string
  lastResult?: ExecutionResult
  executionCount: number
  passRate: number
  aiGenerated: boolean
  estimatedDuration?: number
  createdBy: User
  createdAt: string
  updatedAt: string
}

export interface TestStep {
  id: ID
  order: number
  action: string
  expectedResult: string
  actualResult?: string
  status?: ExecutionResult
  screenshot?: string
}

export interface TestLibrary {
  id: ID
  name: string
  description: string
  testCaseCount: number
  projectId: ID
  createdAt: string
}

// ============================================================
// Test Plans & Strategy
// ============================================================

export interface TestStrategy {
  id: ID
  projectId: ID
  title: string
  version: string
  status: 'draft' | 'review' | 'approved'
  scope: string
  objectives: string[]
  testApproach: string
  entryExitCriteria: {
    entry: string[]
    exit: string[]
  }
  testTypes: string[]
  riskMatrix: RiskMatrixItem[]
  resourcePlan: string
  schedule: string
  tools: string[]
  content: string
  generatedBy: 'manual' | 'ai'
  createdBy: User
  createdAt: string
  updatedAt: string
}

export interface RiskMatrixItem {
  risk: string
  probability: 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  mitigation: string
}

export interface TestPlan {
  id: ID
  projectId: ID
  releaseId?: ID
  title: string
  description: string
  status: 'draft' | 'review' | 'approved' | 'active' | 'completed'
  priority: Priority
  startDate: string
  endDate: string
  testCases: ID[]
  assignedTesters: User[]
  stats: TestPlanStats
  createdBy: User
  createdAt: string
  updatedAt: string
}

export interface TestPlanStats {
  totalTestCases: number
  executed: number
  passed: number
  failed: number
  blocked: number
  skipped: number
  notExecuted: number
  progress: number
}

// ============================================================
// Test Execution
// ============================================================

export type TestRunStatus = 'planned' | 'in_progress' | 'completed' | 'aborted' | 'paused'

export interface TestRun {
  id: ID
  projectId: ID
  planId?: ID
  name: string
  description?: string
  status: TestRunStatus
  environment: string
  assignedTo: User
  testCases: TestRunCase[]
  stats: TestRunStats
  startedAt?: string
  completedAt?: string
  createdAt: string
}

export interface TestRunCase {
  id: ID
  testCaseId: ID
  testCase: TestCase
  status: ExecutionResult
  notes?: string
  evidence: Evidence[]
  defects: ID[]
  executedBy?: User
  executedAt?: string
  duration?: number
  stepResults: TestStep[]
}

export interface TestRunStats {
  total: number
  executed: number
  passed: number
  failed: number
  blocked: number
  skipped: number
  notExecuted: number
  passRate: number
  progress: number
}

export interface Evidence {
  id: ID
  type: 'screenshot' | 'video' | 'log' | 'document'
  name: string
  url: string
  size: number
  uploadedAt: string
}

// ============================================================
// Defects
// ============================================================

export type DefectSeverity = 'critical' | 'major' | 'moderate' | 'minor' | 'trivial'
export type DefectStatus =
  | 'new'
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'verified'
  | 'closed'
  | 'rejected'
  | 'deferred'

export interface Defect {
  id: ID
  projectId: ID
  code: string
  title: string
  description: string
  severity: DefectSeverity
  priority: Priority
  status: DefectStatus
  environment: string
  buildVersion: string
  stepsToReproduce: string
  actualResult: string
  expectedResult: string
  linkedTestCases: ID[]
  linkedRequirements: ID[]
  linkedDefects: ID[]
  assignedTo?: User
  reportedBy: User
  evidence: Evidence[]
  comments: Comment[]
  aiAnalysis?: DefectAnalysis
  externalId?: string
  externalSystem?: 'jira' | 'azure_devops'
  resolution?: string
  resolvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface DefectAnalysis {
  rootCause: string
  impactedAreas: string[]
  suggestedFix: string
  similarDefects: string[]
  estimatedFixTime: string
  confidence: number
  analyzedAt: string
}

export interface Comment {
  id: ID
  content: string
  author: User
  createdAt: string
  updatedAt?: string
}

// ============================================================
// RTM (Requirements Traceability Matrix)
// ============================================================

export interface RTMRow {
  requirementId: ID
  requirementCode: string
  requirementTitle: string
  requirementStatus: RequirementStatus
  testCases: {
    id: ID
    code: string
    title: string
    status: TestCaseStatus
    lastResult?: ExecutionResult
  }[]
  defects: {
    id: ID
    code: string
    title: string
    severity: DefectSeverity
    status: DefectStatus
  }[]
  coverage: number
  passRate: number
}

// ============================================================
// Reports
// ============================================================

export type ReportType =
  | 'test_summary'
  | 'defect_report'
  | 'coverage_report'
  | 'execution_report'
  | 'rtm_report'
  | 'trend_analysis'
  | 'release_readiness'
  | 'sprint_report'

export interface Report {
  id: ID
  projectId: ID
  name: string
  type: ReportType
  status: 'generating' | 'ready' | 'failed'
  format: 'pdf' | 'excel' | 'html' | 'csv'
  parameters: Record<string, unknown>
  downloadUrl?: string
  size?: number
  generatedBy: User
  createdAt: string
}

export interface ReportSchedule {
  id: ID
  projectId: ID
  reportType: ReportType
  name: string
  frequency: 'daily' | 'weekly' | 'monthly'
  dayOfWeek?: number
  dayOfMonth?: number
  time: string
  recipients: string[]
  format: 'pdf' | 'excel' | 'html'
  enabled: boolean
  lastRun?: string
  nextRun: string
}

// ============================================================
// Environment Monitor
// ============================================================

export type EnvironmentStatus = 'healthy' | 'degraded' | 'down' | 'maintenance' | 'unknown'
export type EnvironmentType = 'development' | 'testing' | 'staging' | 'production' | 'uat'

export interface Environment {
  id: ID
  projectId?: ID
  name: string
  type: EnvironmentType
  status: EnvironmentStatus
  url?: string
  components: EnvironmentComponent[]
  lastChecked: string
  uptime: number
  responseTime?: number
}

export interface EnvironmentComponent {
  id: ID
  name: string
  type: 'server' | 'api' | 'database' | 'microservice' | 'cache' | 'queue'
  status: EnvironmentStatus
  url?: string
  version?: string
  responseTime?: number
  lastChecked: string
  metrics?: ComponentMetrics
}

export interface ComponentMetrics {
  cpu?: number
  memory?: number
  disk?: number
  requests?: number
  errors?: number
  latency?: number
}

// ============================================================
// Knowledge Base
// ============================================================

export interface KBArticle {
  id: ID
  title: string
  content: string
  category: string
  tags: string[]
  author: User
  views: number
  helpful: number
  notHelpful: number
  relatedArticles: ID[]
  createdAt: string
  updatedAt: string
}

export interface KBCategory {
  id: ID
  name: string
  description: string
  icon: string
  articleCount: number
  subcategories?: KBCategory[]
}

// ============================================================
// AI Assistant
// ============================================================

export interface AIMessage {
  id: ID
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments?: AIAttachment[]
  timestamp: string
  isStreaming?: boolean
}

export interface AIAttachment {
  id: ID
  type: 'file' | 'image' | 'requirement' | 'test_case' | 'defect'
  name: string
  content?: string
  url?: string
}

export interface AIConversation {
  id: ID
  title: string
  projectId?: ID
  messages: AIMessage[]
  context?: AIContext
  createdAt: string
  updatedAt: string
}

export interface AIContext {
  project?: Project
  requirement?: Requirement
  testCase?: TestCase
  defect?: Defect
  customContext?: string
}

// ============================================================
// Dashboard
// ============================================================

export interface DashboardMetrics {
  totalProjects: number
  activeProjects: number
  totalTestCases: number
  totalDefects: number
  openDefects: number
  averageCoverage: number
  overallPassRate: number
  totalRequirements: number
  pendingReviews: number
}

export interface ActivityItem {
  id: ID
  type:
    | 'test_executed'
    | 'defect_created'
    | 'requirement_added'
    | 'test_case_created'
    | 'project_created'
    | 'defect_resolved'
  description: string
  user: User
  project: {
    id: ID
    name: string
    code: string
  }
  metadata?: Record<string, unknown>
  timestamp: string
}

export interface ProjectHealth {
  projectId: ID
  projectName: string
  projectCode: string
  coverage: number
  passRate: number
  openDefects: number
  criticalDefects: number
  progress: number
  status: ProjectStatus
  risk: 'low' | 'medium' | 'high' | 'critical'
}

// ============================================================
// UI State Types
// ============================================================

export interface UIState {
  sidebarCollapsed: boolean
  activeProject: Project | null
  notifications: Notification[]
  unreadNotifications: number
  globalSearch: string
  theme: 'light' | 'dark' | 'system'
}

export interface Notification {
  id: ID
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, string[]>
  statusCode: number
}

// ============================================================
// Form Types
// ============================================================

export interface CreateProjectForm {
  name: string
  code: string
  description: string
  type: ProjectType
  priority: Priority
  startDate: string
  endDate?: string
  teamMembers: { userId: ID; role: UserRole }[]
  tags: string[]
  integrations: Partial<ProjectIntegration>[]
}

export interface CreateTestCaseForm {
  title: string
  description?: string
  type: TestCaseType
  priority: Priority
  preconditions?: string
  steps: Omit<TestStep, 'id'>[]
  expectedResult: string
  linkedRequirements: ID[]
  tags: string[]
  estimatedDuration?: number
}

export interface CreateDefectForm {
  title: string
  description: string
  severity: DefectSeverity
  priority: Priority
  environment: string
  buildVersion: string
  stepsToReproduce: string
  actualResult: string
  expectedResult: string
  linkedTestCases: ID[]
  linkedRequirements: ID[]
  assignedTo?: ID
}

export interface GenerateTestCasesRequest {
  projectId: ID
  sourceType: 'requirement' | 'change_request' | 'pbi' | 'api_spec' | 'free_text'
  sourceContent: string
  testTypes: TestCaseType[]
  count?: number
  language?: string
  includeNegative?: boolean
  includeBoundary?: boolean
}

export interface GeneratedTestCase extends Omit<CreateTestCaseForm, 'linkedRequirements'> {
  id: string
  selected: boolean
  sourceSection?: string
}
