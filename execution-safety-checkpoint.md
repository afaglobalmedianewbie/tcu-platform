# Execution safety checkpoint

Generated: 2026-07-14T20:50:53Z

Notes: Read-only checks. No deployments, migrations, or restarts performed.

## docker ps
```
/bin/bash: line 12: docker: command not found
```

## docker compose ls
```
/bin/bash: line 17: docker: command not found
/bin/bash: line 17: docker-compose: command not found
```

## pm2 list
```
/bin/bash: line 22: pm2: command not found
```

## ss -tulpn
```
/bin/bash: line 27: /usr/bin/ss: Permission denied
/bin/bash: line 27: netstat: command not found
```

## df -h
```
df: cannot read table of mounted file systems: Permission denied
```

## free -h
```
               total        used        free      shared  buff/cache   available
Mem:            15Gi       5.0Gi       266Mi        24Mi        10Gi        10Gi
Swap:          4.0Gi       205Mi       3.8Gi
```

## ls -la /opt/tcu-platform
```
ls: cannot access '/opt/tcu-platform': No such file or directory
```

## find /opt/tcu-platform -maxdepth 3 -type f | sort (first 500 lines)
```
find: ‘/opt/tcu-platform’: No such file or directory
```
