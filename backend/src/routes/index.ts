import { Router, Request, Response, Express } from 'express';
import fs from 'fs';
import path from 'path';
const { execSync } = require('child_process');
const spawn = require('child_process').spawn;

const router: Router = Router();

interface FileData {
  filePath: string;
  content: string;
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}



function extractFiles(response: string): FileData[] {
  const files: FileData[] = [];

  // Match lines like: `filename.ext` followed by a code block
  // Example: public/index.html\n```html\n ...code... \n```
  const fileBlockRegex = /^([^\n]+)\n```(?:\w*)\n([\s\S]*?)```/gm;
  let match: RegExpExecArray | null;

  while ((match = fileBlockRegex.exec(response)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].replace(/\r\n/g, "\n"); // normalize line endings
    files.push({ filePath, content });
  }

  return files;
}


function extractProjectRoot(response: string): string {
  const structureRegex = /```\n(.+)\/\n/;
  const match = structureRegex.exec(response);
  return match ? match[1].trim() : 'project';
}

async function createProject(response: string) {
  // const projectRoot = extractProjectRoot(response);

  const projectRoot = 'react-app';

  const files = extractFiles(response);

  for (const { filePath, content } of files) {
    const fullPath = path.join(projectRoot, filePath);
    const dir = path.dirname(fullPath);
    ensureDir(dir);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Created: ${fullPath}`);
  }
}

interface SaveFilesBody {
  message: string;
}

// Home route
router.get('/', (req: Request, res: Response) => {
  res.send('This is home page');
});

// Save files route
router.post('/save-files', async (req: any, res: any) => {
  try {
    const openrouterResponse = req.body.messages;
    if (!openrouterResponse) {
      return res.status(400).json({ message: 'No message provided' });
    }
    console.log(openrouterResponse);

    await createProject(openrouterResponse);

    const projectDir = path.join(process.cwd(), 'react-app');
    // 0) Move public/index.html to project root (react-app/index.html)
    try {
      const publicIndex = path.join(projectDir, 'public', 'index.html');
      const targetIndex = path.join(projectDir, 'index.html');

      if (fs.existsSync(publicIndex)) {
        try {
          fs.renameSync(publicIndex, targetIndex);
          console.log(`Moved ${publicIndex} -> ${targetIndex}`);
        } catch (err) {
          // fallback to copy+unlink if rename fails (cross-device)
          fs.copyFileSync(publicIndex, targetIndex);
          fs.unlinkSync(publicIndex);
          console.log(`Copied and removed ${publicIndex} -> ${targetIndex}`);
        }
      } else {
        console.log('No public/index.html to move at', publicIndex);
      }
      
    } catch (err) {
      console.error('Failed to move public/index.html:', err);
    }
    // 1) Update devDependencies versions to "*"
    try {
      const pkgPath = path.join(projectDir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.devDependencies && typeof pkg.devDependencies === 'object') {
          for (const name of Object.keys(pkg.devDependencies)) {
            pkg.devDependencies[name] = '*';
          }
          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
          console.log(`Updated devDependencies to "*" in ${pkgPath}`);
        } else {
          console.warn('No devDependencies found in', pkgPath);
        }
      } else {
        console.warn('package.json not found at', pkgPath);
      }
    } catch (err) {
      console.error('Failed to update package.json devDependencies:', err);
    }


    // 2) Overwrite postcss.config.cjs with the required config
    try {
        const postcssPath = path.join(projectDir, 'postcss.config.cjs');
        const postcssContent = `module.exports = {
    plugins: [
      require('@tailwindcss/postcss'),
      require('autoprefixer'),
    ],
  };
`;
      fs.writeFileSync(postcssPath, postcssContent, 'utf8');
      console.log('Wrote postcss.config.cjs at', postcssPath);
    } catch (err) {
      console.error('Failed to write postcss.config.cjs:', err);
    }

    // 3) Run npm install, then install tailwind postcss plugin as devDependency
    try {
      console.log('Running npm install in', projectDir);
      execSync('npm install', { cwd: projectDir, stdio: 'inherit' });

      console.log('Installing @tailwindcss/postcss as devDependency');
      execSync('npm install -D @tailwindcss/postcss', { cwd: projectDir, stdio: 'inherit' });
    } catch (err) {
      console.error('npm install step failed:', err);
      throw err; // let outer catch handle response
    }




    // 4) Run npm install, then install tailwind postcss plugin as devDependency
    try {
      // start dev server bound to 127.0.0.1 in background (non-blocking)
      const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1'], {
        cwd: projectDir,
        stdio: 'inherit',
        detached: true,
      });
      server.unref();
      console.log('Started dev server on 127.0.0.1 (detached)');
      try {
        // run npm install but capture output instead of inheriting stdio so we can return/log errors
        try {
          execSync('npm install', { cwd: projectDir, stdio: 'pipe' });
        } catch (e: any) {
          const stdout = e.stdout ? e.stdout.toString() : '';
          const stderr = e.stderr ? e.stderr.toString() : e.message || '';
          const combined = `npm install failed.\nstdout:\n${stdout}\nstderr:\n${stderr}`;
          console.error(combined);
          // throw a new Error with combined output so outer catch can return it
          throw new Error(combined);
        }
      } catch (err) {
        console.error('server start failed', err);
        throw err; // let outer catch handle response
      }

    } catch (err) {
      console.error('server start failed', err);
      throw err; // let outer catch handle response
    }

    // let write 



    res.status(200).json({ message: 'Files saved successfully' });
  } catch (error) {
    console.error('Error saving files:', error);
    res.status(500).json({ message: 'Failed to save files', error });
  }
}
);



export default router;
