---
name: Workspace Guidelines
description: General coding rules and guidelines for this workspace.
trigger: always_on
---

# Workspace Guidelines

1. Always write clear, well-documented code.
2. Follow standard coding conventions for this project.

## Docker & Environment Rules
3. When using `env_file` in docker-compose, write `.env` values WITHOUT quotes. Quotes become literal characters.
4. When using Prisma with `node:*-alpine` Docker images, always add `RUN apk add --no-cache openssl` before `prisma generate`.
5. Use Prisma 5.x (`prisma@5`, `@prisma/client@5`) for projects using classic `schema.prisma` with `url = env("DATABASE_URL")`.

## Deployment Stack (TCU Platform)
6. Frontend: Next.js 16 on PM2 (port 3001). Backend: Express + Prisma in Docker (port 3000). Database: PostgreSQL 15 in Docker (port 5432). NGINX reverse proxy on 80/443.
7. For `npm install`, `prisma migrate`, and builds requiring network: always use BypassSandbox.

## Task Chunking & Error Recovery
8. When building multiple pages/files, create them sequentially (1-2 files per step), never all at once.
9. Do NOT spawn multiple heavy-duty subagents in parallel for code generation—it triggers rate limits (429).
24. When `run_command` fails with connection errors, retry up to 3 times with a brief pause before reporting failure to the user.

## Network & Infrastructure Architecture (TCU Platform)
11. Mikrotik Interconnection: Do NOT write code that uses direct HTTP API calls to Mikrotik. All connections to Mikrotik/OLT must route through a VPN tunnel.
12. Customer Authentication: Rely on a RADIUS server (FreeRADIUS) for PPPoE/Hotspot authentication over the VPN (not direct API).
13. FTTH Management: Use GenieACS (TR-069) or SNMP over the VPN for ONT/modem management.
14. Mail Server: The VPS has a local Postfix/Dovecot setup. Use `nodemailer` connecting to `127.0.0.1:25` without TLS for automated emails.

## Branding Constraints
15. **Brand Identity**: The application is "TCU Platform" (PT Top Class Universal). The official domain is `topclass.id`.
16. **Legacy Brands**: NEVER generate or use code containing legacy brands: "Airo", "Radboox", or "AFA Global Media". Always replace them with TCU Platform equivalents if found.

## Mail Server & DNS Local Rules
17. Selalu arahkan host mail server (mail.topclassuniversal.co.id) ke loopback 127.0.0.1 di /etc/hosts pada VPS agar Webmail lokal tidak merutekan lalu lintas IMAP/SMTP ke IP eksternal.
18. Pastikan Postfix dikonfigurasi dengan virtual_uid_maps dan virtual_gid_maps static:5000 (vmail user) untuk menjamin kelancaran pengiriman ke virtual mailboxes.
19. Setiap kali menggunakan koneksi TLS pada Dovecot, pastikan dh.pem 2048-bit digenerate dan dimasukkan ke parameter ssl_dh untuk mencegah error SSL handshake.

