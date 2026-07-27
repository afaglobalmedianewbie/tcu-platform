# TCU PLATFORM ARCHITECTURE CONTEXT
## Environment Specifications:
- Host OS: Ubuntu Server (56 vCPU, 16GB RAM)
- Domain Utama: topclassuniversal.co.id
- Network Access: Cloudflare Tunnel Only (No Public NAT Inbound)

## Project Components Directory:
1. `/home/tcu/frontend_new` -> Modern UI/UX Web Platform
2. `/home/tcu/tcu-backend` -> Core Service Logic
3. `/home/tcu/llm-engine` -> Local AI Automation Module
4. `/home/tcu/docs/` -> Contains database schemas & system configurations

*RULES FOR AI ASSISTANT: DO NOT create separate nginx configuration files outside the docker-compose mesh. Keep infrastructure unified.*
