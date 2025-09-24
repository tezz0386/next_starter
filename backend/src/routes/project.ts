import ProjectController from "../app/controller/ProjectController";
import { Router, Request, Response, Express } from 'express';
const projectRouter: Router = Router();

projectRouter.get('/projects', ProjectController.index);
projectRouter.get('/projects/:id', ProjectController.edit);
projectRouter.post('/projects', ProjectController.store);
projectRouter.patch('/projects/:id', ProjectController.update);
projectRouter.delete('/projects/:id', ProjectController.delete);

export default projectRouter;
