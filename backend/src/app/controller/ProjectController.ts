import type { ReqResNext } from '../type/type';
import type { Request, Response, NextFunction } from 'express';
import Project, { ProjectInterface } from '../models/Project'; // Import User model and IUser interface
import User from '../models/User';
import Message from "../models/Message";
import multer from "multer";
import fs from 'fs';
import path from 'path';

import { execSync }  from 'child_process';
import { spawn } from 'child_process';


// Define the shape of the ProjectController
interface ProjectController {
  index: (req: Request, res: Response, next: NextFunction)=> Promise<void>;
  store: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  edit: (req: Request, res: Response, next: NextFunction)=> Promise<void>;
  update: ({req,res,next}:ReqResNext) => Promise<void>;
  delete: ({req,res,next}:ReqResNext) => Promise<void>;
}

const ProjectController: ProjectController = {
  index: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Return latest projects first. Optional ?limit=<n> to limit results.
      const limit = req.query?.limit ? parseInt(String(req.query.limit), 10) : 0;
      const sort:any = { createdAt: -1, _id: -1 }; // newest first
      let query = Project.find({}).sort(sort);
      if (limit > 0) query = query.limit(limit);
      const projects = await query.exec();

      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error); // Pass errors to Express error handler
    }
  },



  store: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Setup multer for handling file uploads
      const upload = multer({ dest: "uploads/" }).fields([
        { name: "plain_text", maxCount: 1 },
        { name: "response", maxCount: 1 },
      ]);

      // Wrap multer in a promise so we can await it
      await new Promise<void>((resolve, reject) => {
        upload(req, res, (err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Small fields remain in req.body
      const { project_id, message, project_type } = req.body;

      // Read file contents
      const plainTextFile = (req as any).files?.["plain_text"]?.[0];
      const responseFile = (req as any).files?.["response"]?.[0];

      const plain_text = plainTextFile
        ? fs.readFileSync(plainTextFile.path, "utf-8")
        : "";
      const response = responseFile
        ? fs.readFileSync(responseFile.path, "utf-8")
        : "";

      let project;

      // If project_id is provided, find the project
      if (project_id) {
        project = await Project.findById(project_id);
        if (!project) {
          res.status(404).json({
            success: false,
            message: "Project not found",
          });
          return;
        }
      } else {
        // If project_id is not provided, create a new project
        const user = await User.findOne().sort({ _id: 1 });
        const projet_name: string = generateRandomProjectName();
        const folder_path = await saveProject(
          plain_text,
          projet_name,
          project_type ?? "static_site"
        );

        project = await Project.create({
          name: projet_name,
          user_id: user?._id,
          project_type: project_type ?? "static_site",
          folder_path: folder_path,
        });
      }

      // Save the message
      const savedMessage = await Message.create({
        project_id: project._id,
        message: message, // message content
        response: response,
        plain_text: plain_text,
      });

      // Clean up uploaded files
      if (plainTextFile) fs.unlinkSync(plainTextFile.path);
      if (responseFile) fs.unlinkSync(responseFile.path);

      res.status(201).json({
        success: true,
        data: {
          project,
          message: savedMessage,
        },
        message: "Message saved successfully",
      });
    } catch (error) {
      next(error);
    }
  },


  edit: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projectId = req.params.id as string;
      const project = await Project.findById(projectId);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found',
        });
        return;
      }


      // Fetch latest 10 messages for this project (latest first)
      const messages = await Message.find({ project_id: project._id }).sort({ createdAt: -1 }).limit(10);

      res.status(200).json({
        success: true,
        data: {
          project,
          messages,
        },
      });

    }catch(err){
       res.status(500).json({
        success: true,
        data: {
       
        },
      });
    }
  },

  update: async ({req,res,next}:ReqResNext): Promise<void> => {
    try {
      const userId = req.params.id as string;
      const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: user,
        message: 'User Updated Successfully',
      });
    } catch (error) {
      next(error); // Pass errors to Express error handler
    }
  },

  delete: async ({req,res,next}:ReqResNext): Promise<void> => {
    try {
      const userId = req.params.id as string;
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'User Deleted Successfully',
      });
    } catch (error) {
      next(error); // Pass errors to Express error handler
    }
  },
};

export default ProjectController;












export function generateRandomProjectName(){
  // Array of sample words for project names
  const words = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Phoenix', 'Nimbus',
    'Vertex', 'Quantum', 'Nova', 'Echo', 'Titan', 'Orion', 'Luna'
  ];

  // Pick a random word
  const randomWord = words[Math.floor(Math.random() * words.length)];

  // Get current date and time as YYYYMMDD_HHMMSS
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
                  String(now.getMonth() + 1).padStart(2, '0') +
                  String(now.getDate()).padStart(2, '0') + '_' +
                  String(now.getHours()).padStart(2, '0') +
                  String(now.getMinutes()).padStart(2, '0') +
                  String(now.getSeconds()).padStart(2, '0');

  // Combine word and date
  const projectName = `${randomWord}_${dateStr}`;
  return projectName;
}






async function saveProject(openrouterResponse:string, project_name:string, project_type:string="static_site"){
  try {
    if (!openrouterResponse) {
      return '';
    }
    await createProject(openrouterResponse, project_name);
    const projectDir = path.join(process.cwd(), project_name);
    // 0) Move public/index.html to project root (react-app/index.html)
    if(project_type == "react"){
      try{
        await executeForReact(projectDir);
      }catch(error){
        console.log("error ", error);
      }
    }
    return projectDir;
  } catch (error) {
    console.error('Error saving files:', error);
    return '';
  }
}

async function executeForReact(projectDir:string){
  try {
      const publicIndex = path.join(projectDir, 'public', 'index.html');
      const targetIndex = path.join(projectDir, 'index.html');

      if (fs.existsSync(publicIndex)) {
        try {
          fs.renameSync(publicIndex, targetIndex);
          console.log(`Moved ${publicIndex} -> ${targetIndex}`);
        } catch (err) {
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
}

// let save the project

interface FileData {
  filePath: string;
  content: string;
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}




function extractProjectRoot(response: string): string {
  const structureRegex = /```\n(.+)\/\n/;
  const match = structureRegex.exec(response);
  return match ? match[1].trim() : 'project';
}



function extractFiles(response: string): FileData[] {
  const files: FileData[] = [];

  // Match lines like: `filename.ext` followed by a code block
  // Example: public/index.html\n```html\n ...code... \n```
  const fileBlockRegex = /^([^\n]+)\n```(?:\w*)\n([\s\S]*?)```/gm;
  let match: RegExpExecArray | null;

  while ((match = fileBlockRegex.exec(response)) !== null) {
      const rawPath = match[1].trim();
    const filePath = rawPath.replace(/^\d+\)?\s*/, ''); // ✅ sanitize path
    const content = match[2].replace(/\r\n/g, "\n"); // normalize line endings
    files.push({ filePath, content });
  }

  return files;
}

async function createProject(response: string, project_name:string) {
  // const projectRoot = extractProjectRoot(response);

  const projectRoot = project_name;

  const files = extractFiles(response);

  for (const { filePath, content } of files) {
    const fullPath = path.join(projectRoot, filePath);
    const dir = path.dirname(fullPath);
    ensureDir(dir);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Created: ${fullPath}`);
  }
}