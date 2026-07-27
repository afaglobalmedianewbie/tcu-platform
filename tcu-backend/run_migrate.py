import pty
import os
import subprocess

cmd = ['npx', 'prisma', 'migrate', 'dev', '--name', 'phase14_business_schema', '--schema', 'prisma/schema.prisma']

env = os.environ.copy()
env['DATABASE_URL'] = 'postgresql://tcu_staging_user:staging_super_secret_password_123@127.0.0.1:55432/tcu_platform_staging'

master, slave = pty.openpty()
p = subprocess.Popen(cmd, env=env, stdin=slave, stdout=slave, stderr=slave, close_fds=True)
os.close(slave)

while True:
    try:
        data = os.read(master, 1024)
    except OSError:
        break
    if not data:
        break
    text = data.decode('utf-8', errors='replace')
    print(text, end='', flush=True)
    
    # Auto-reply 'y' to Prisma prompts
    if "?" in text or "We need to reset" in text or "Are you sure" in text or "Do you want to continue" in text:
        os.write(master, b'y\n')

p.wait()
os.close(master)
import sys
sys.exit(p.returncode)
