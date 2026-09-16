# Rendley REST API (no MCP client)

When the MCP tools aren't available, the same Rendley agent is reachable over plain HTTP. Use this path inside scripts, backends, or environments that don't speak MCP.

The endpoints live on the same host as the MCP server: `https://mcp.rendley.com`. Auth is the same: `Authorization: Bearer <RENDLEY_API_KEY>`. The `Bearer ` prefix is required.

## Start a job

`POST https://mcp.rendley.com/v1/agent`

```bash
curl -X POST https://mcp.rendley.com/v1/agent \
  -H "Authorization: Bearer YOUR_RENDLEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Edit this interview into a 3-minute reel with captions and music.",
    "files": [{ "url": "https://cdn.example.com/interview.mp4" }]
  }'
```

Body:

| Field        | Type             | Notes                                                                |
| ------------ | ---------------- | -------------------------------------------------------------------- |
| `prompt`     | string, required | The brief, in plain language. Same content you would put in `edit_video.message`. |
| `project_id` | string, optional | Edit an existing project. A new one is created if omitted.           |
| `files`      | array, optional  | Each `{ url }` pointing at a public https file.                      |
| `thread_id`  | string, optional | Continue a previous job's conversation.                              |

Response:

```json
{
  "job_id": "job_8f2c...",
  "status": "pending",
  "project_id": "prj_...",
  "thread_id": "thr_..."
}
```

The first call returns in under a second. The render happens while you poll.

## Poll the job

`GET https://mcp.rendley.com/v1/jobs/{job_id}`

```bash
curl https://mcp.rendley.com/v1/jobs/job_8f2c... \
  -H "Authorization: Bearer YOUR_RENDLEY_API_KEY"
```

Fetch every few seconds until `status` is `completed` or `failed`.

```json
{
  "job_id": "job_8f2c...",
  "status": "completed",
  "result": {
    "project_id": "prj_...",
    "project_url": "https://app.rendley.com/...",
    "thread_id": "thr_..."
  },
  "error": null
}
```

A completed job is kept for about an hour, then evicted. Save `project_url` when the job finishes.

## Exporting a downloadable file

The `/v1/agent` job finishes when the edit is saved on the timeline. It does not return an MP4. To get a downloadable file from a script, hit Rendley's full REST API export endpoint (separate from the agent). See `https://docs.rendley.com/api/render-a-video` for the flow. Or open the `project_url` and export from the editor.

## Notes

- If the queue is busy, the agent endpoint returns `429`. Respect the `Retry-After` header.
- Use the same API key everywhere. Treat it like a password; rotate by creating a new one and deleting the old.
- The agent endpoint and the MCP endpoint share the same workspace, projects, and credits.
