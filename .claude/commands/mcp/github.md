# /github — GitHub Operations

> **MCP WRAPPER** — This is documentation only. After reading, you MUST use the MCP tools:
> → Tools: `mcp__github__*` (see list below)

Full GitHub API access for repos, issues, PRs, and code search.

## Tools

**Repositories**
- `create_repository` — Create new repo
- `fork_repository` — Fork a repo
- `search_repositories` — Search repos
- `get_file_contents` — Read file/directory from repo
- `create_or_update_file` — Write single file
- `push_files` — Push multiple files in one commit
- `create_branch` — Create new branch
- `list_commits` — List commit history

**Issues**
- `create_issue` — Create issue
- `list_issues` — List/filter issues
- `get_issue` — Get issue details
- `update_issue` — Update issue
- `add_issue_comment` — Comment on issue

**Pull Requests**
- `create_pull_request` — Create PR
- `list_pull_requests` — List PRs
- `get_pull_request` — Get PR details
- `get_pull_request_files` — Files changed in PR
- `get_pull_request_status` — CI/check status
- `get_pull_request_comments` — PR comments
- `get_pull_request_reviews` — PR reviews
- `create_pull_request_review` — Submit review
- `merge_pull_request` — Merge PR
- `update_pull_request_branch` — Update branch from base

**Search**
- `search_code` — Search code across GitHub
- `search_issues` — Search issues/PRs
- `search_users` — Search users

## When to Use
- Creating/managing issues and PRs
- Searching code across repositories
- Automating GitHub workflows

Claude will use these tools when you ask about GitHub operations.
