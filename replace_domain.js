const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetStr = 'topclass.id';
const replaceStr = 'topclassuniversal.co.id';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fullPath.includes('node_modules') || fullPath.includes('.git') || fullPath.includes('.next')) continue;
    
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else {
      if (['.js', '.md', '.env', '.prisma', '.yml', '.conf'].some(ext => fullPath.endsWith(ext) || fullPath.includes('.env'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes(targetStr) || content.includes('TopClass.id')) {
            const newContent = content
              .replace(/topclass\.id/g, replaceStr)
              .replace(/TopClass\.id/g, 'TopClassUniversal.co.id')
              .replace(/topclass.id/gi, replaceStr);
            fs.writeFileSync(fullPath, newContent);
            console.log(`Replaced in ${fullPath}`);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }
}

replaceInDir('/home/tcu/tcu-backend');
replaceInDir('/home/tcu/frontend_new');
