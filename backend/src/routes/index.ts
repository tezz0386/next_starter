import { Router, Request, Response, Express } from 'express';
import fs from 'fs';
import path from 'path';

const router: Router = Router();

interface FileData {
  filePath: string;
  content: string;
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function extractFiles(response: string): FileData[] {
  // Matches:
  // 1) path/to/file
  // Optional description lines
  // ```lang
  // code
  // ```
  const fileRegex = /\d+\)\s+([^\n]+)(?:\n[-\s\S]*?)?\n```(?:\w*)\n([\s\S]*?)```/g;
  const files: FileData[] = [];
  let match: RegExpExecArray | null;

  while ((match = fileRegex.exec(response)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].replace(/\r\n/g, '\n'); // normalize line endings
    files.push({ filePath, content });
  }

  return files;
}

function extractProjectRoot(response: string): string {
  const structureRegex = /```\n(.+)\/\n/;
  const match = structureRegex.exec(response);
  return match ? match[1].trim() : 'project';
}

function createProject(response: string) {
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
router.post('/save-files', (req: any, res: any) => {
    try {
      const openrouterResponse = req.body.messages;
      if (!openrouterResponse) {
        return res.status(400).json({ message: 'No message provided' });
      }
      console.log(openrouterResponse);
      
      createProject(openrouterResponse);

      res.status(200).json({ message: 'Files saved successfully' });
    } catch (error) {
      console.error('Error saving files:', error);
      res.status(500).json({ message: 'Failed to save files', error });
    }
  }
);



export default router;
