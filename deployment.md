# Deployment tips

- Use Docker image (see Dockerfile).
- Use environment variables in your cloud provider secret store.
- Use a process manager (systemd, supervisor, or use Gunicorn+Uvicorn workers).
- Secure Supabase keys: prefer service_role keys for server-to-server operations but restrict access using network rules.
- If using OpenAI, keep API key secret and consider rate limits / batching.
