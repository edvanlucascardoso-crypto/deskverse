export type PhysicalQueue = "LLM" | "CPU" | "GPU" | "BROWSER" | "RENDER";
export type LogicalQueue = "leader_session" | "workspace_capability";
export type QueuePriority = "URGENT" | "HIGH" | "NORMAL" | "LOW";
export type QueueJobState = "PENDING" | "READY" | "RUNNING" | "WAITING_USER" | "WAITING_APPROVAL" | "RETRY_SCHEDULED" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "DEAD_LETTER";

export type QueueJobError = {
  code: string;
  message: string;
  retryable: boolean;
  occurredAt: number;
};

export type TraceContext = {
  traceId: string;
  workspaceId: string;
  taskId?: string;
  leaderRunId?: string;
  idempotencyKey?: string;
};

export type ReasoningTrace = {
  requestedReasoning: string;
  effectiveReasoning: string;
  downgradeReason?: string;
};

export type AgentRuntime = {
  start(input: { runId: string; workspaceId: string; trace: TraceContext }): Promise<{ executionId: string }>;
  pause(input: { executionId: string; checkpoint: Record<string, unknown> }): Promise<void>;
  cancel(input: { executionId: string; reason: string }): Promise<void>;
};

export type InferenceGateway = {
  complete(input: {
    model: string;
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    trace: TraceContext;
    reasoning: ReasoningTrace;
  }): Promise<{ text: string; usage?: { inputTokens: number; outputTokens: number } }>;
};

export type WorkerExecutionProvider = {
  dispatch(input: { queue: PhysicalQueue; jobId: string; workspaceId: string; payload: Record<string, unknown> }): Promise<{ executionId: string }>;
  cancel(input: { executionId: string; reason: string }): Promise<void>;
};

export type McpRemoteClient = {
  call<TInput extends Record<string, unknown>, TOutput>(input: {
    tool: string;
    input: TInput;
    trace: TraceContext;
    requiresApproval: boolean;
  }): Promise<TOutput>;
};

export type QueueJob = {
  id: string;
  workspaceId: string;
  runId: string;
  parentRunId?: string;
  jobType: string;
  leaderId?: string;
  capability?: string;
  logicalQueue: LogicalQueue;
  resourceClass: PhysicalQueue;
  priority: QueuePriority;
  state: QueueJobState;
  createdAt: number;
  updatedAt?: number;
  availableAt: number;
  attempt: number;
  maxAttempts: number;
  idempotencyKey?: string;
  payload: Record<string, unknown>;
  origin?: string;
  responsible?: string;
  nextStep?: string;
  lastError?: QueueJobError;
  cancelReason?: string;
  waitReason?: string;
  checkpoint?: Record<string, unknown>;
  leaseUntil?: number;
};

export type QueueLease = QueueJob & {
  leaseId: string;
  workerId: string;
  leasedAt: number;
  heartbeatAt: number;
  leaseUntil: number;
};

export type QueueFailureResult = {
  state: QueueJobState;
  retried: boolean;
  deadLettered: boolean;
  retryAt?: number;
};

export type QueueBackend = {
  enqueue(job: QueueJob): Promise<{ job: QueueJob; deduplicated: boolean }>;
  claim(input: { resourceClass: PhysicalQueue; workerId: string; now?: number }): Promise<QueueLease | null>;
  heartbeat(input: { leaseId: string; workerId: string; now?: number }): Promise<boolean>;
  complete(input: { leaseId: string; workerId: string; now?: number }): Promise<boolean>;
  fail(input: { leaseId: string; workerId: string; technical: boolean; now?: number; retryAfterMs?: number; error?: QueueJobError }): Promise<QueueFailureResult>;
  wait(input: { leaseId: string; workerId: string; state: "WAITING_USER" | "WAITING_APPROVAL"; reason?: string; checkpoint?: Record<string, unknown>; now?: number }): Promise<boolean>;
  resume(input: { jobId: string; workspaceId: string; now?: number }): Promise<boolean>;
  cancel(input: { jobId: string; workspaceId: string; reason: string }): Promise<boolean>;
  cancelCascade(input: { rootJobId: string; workspaceId: string; reason: string }): Promise<number>;
  reprocess(input: { jobId: string; workspaceId: string; now?: number }): Promise<boolean>;
  list(input: { workspaceId?: string; resourceClass?: PhysicalQueue; states?: QueueJobState[]; now?: number }): Promise<QueueJob[]>;
  depth(input: { resourceClass: PhysicalQueue; workspaceId?: string; now?: number }): Promise<number>;
  deadLetters(input: { workspaceId?: string }): Promise<QueueJob[]>;
};

export type AssetReference = {
  assetId: string;
  workspaceId: string;
  key: string;
  url?: string;
  checksum?: string;
  contentType: string;
  size: number;
  status: "pending" | "ready" | "failed";
};

export type AssetStorage = {
  put(input: { workspaceId: string; assetId: string; bytes: Uint8Array; contentType: string }): Promise<AssetReference>;
  remove(input: { workspaceId: string; assetId: string }): Promise<void>;
  signedUrl(input: { workspaceId: string; assetId: string }): Promise<string>;
};
