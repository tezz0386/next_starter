import type { ReqResNext } from '../type/type';
import type { Request, Response, NextFunction } from 'express';
import Project, { ProjectInterface } from '../models/Project'; // Import User model and IUser interface
import User from '../models/User';
import Message from "../models/Message";

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
      const { project_id, message, response, plain_text } = req.body;

      let project;
      // If project_id is provided, find the project
      if (project_id) {
        project = await Project.findById(project_id);
        if (!project) {
          res.status(404).json({
            success: false,
            message: 'Project not found',
          });
          return;
        }
      } else {
        // If project_id is not provided, create a new project
        const user = await User.findOne().sort({ _id: 1 });
        project = await Project.create({
          name: generateRandomProjectName(),
          user_id: user?._id,
          folder_path: '',
        });
      }

      // Save the message (assuming Message model exists)
      const savedMessage = await Message.create({
        project_id: project._id,
        message: message, // message content
        response: response,
        plain_text:plain_text,
      });

      res.status(201).json({
        success: true,
        data: {
          project,
          message: savedMessage,
        },
        message: 'Message saved successfully',
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
      const messages = await Message.find({ project_id: project._id }).limit(10);

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