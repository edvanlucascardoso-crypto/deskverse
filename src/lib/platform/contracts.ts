export type PhysicalQueue = "LLM" | "CPU" | "GPU" | "BROWSER" | "RENDER";
export type LogicalQueue = "leader_session" | "workspace_capability";
export type QueuePriority = "URGENT" | "HIGH" | "NORMAL" | "LOW";

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
  leaderId?: string;
  capability?: string;
  logicalQueue: LogicalQueue;
  physicalQueue: PhysicalQueue;
  priority: QueuePriority;
  idempotencyKey?: string;
  payload: Record<string, unknown>;
  maxRetries: number;
};

export type QueueLease = QueueJob & {
  leaseId: string;
  workerId: string;
  attempts: number;
  leasedAt: number;
  heartbeatAt: number;
};

export type QueueBackend = {
  enqueue(job: QueueJob): Promise<{ job: QueueJob; deduplicated: boolean }>;
  claim(input: { physicalQueue: PhysicalQueue; workerId: string; now?: number }): Promise<QueueLease | null>;
  heartbeat(input: { leaseId: string; workerId: string; now?: number }): Promise<boolean>;
  complete(input: { leaseId: string; workerId: string }): Promise<boolean>;
  fail(input: { leaseId: string; workerId: string; technical: boolean; now?: number }): Promise<{ retried: boolean; deadLettered: boolean }>;
  cancel(input: { jobId: string; workspaceId: string; reason: string }): Promise<boolean>;
  cancelCascade(input: { rootJobId: string; workspaceId: string; reason: string }): Promise<number>;
  depth(input: { physicalQueue: PhysicalQueue; workspaceId?: string }): Promise<number>;
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
