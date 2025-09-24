import type { ReqResNext } from '../type/type';
import User, { UserInterface } from '../models/User'; // Import User model and IUser interface
// Define the shape of the UserController
interface UserController {
  index: ({req,res,next}:ReqResNext) => Promise<void>;
  store: ({req,res,next}:ReqResNext) => Promise<void>;
  edit: ({req,res,next}:ReqResNext) => Promise<void>;
  update: ({req,res,next}:ReqResNext) => Promise<void>;
  delete: ({req,res,next}:ReqResNext) => Promise<void>;
}

const UserController: UserController = {
  index: async ({req,res,next}:ReqResNext): Promise<void> => {
    try {
      const users = await User.find({});
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error); // Pass errors to Express error handler
    }
  },

  store: async ({req,res,next}:ReqResNext): Promise<void> => {
    try {
      const user = await User.create({
        name: req.body.name || 'Default Name',
        email: req.body.email || 'defaultemail@gmail.com',
        password: req.body.password || 'Default Password',
      });
      res.status(201).json({
        success: true,
        data: user,
        message: 'User Created Successfully',
      });
    } catch (error) {
      next(error); // Pass errors to Express error handler
    }
  },

  edit: async ({req,res,next}:ReqResNext): Promise<void> => {
    try {
      const userId = req.params.id as string;
      const user = await User.findById(userId);
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
        message: 'User for Edit',
      });
    } catch (error) {
      next(error); // Pass errors to Express error handler
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

export default UserController;