 import express from 'express';
import { createCourse,updateCourse,deleteCourse,getCourse,courseDetails,buyCourses  } from '../controllers/course.controllers.js';
import userMiddleware from '../middleware/user.mid.js';
import adminMiddleware from '../middleware/admin.mid.js';

const router = express.Router();
router.post('/create',adminMiddleware, createCourse);
router.put("/update/:courseId", adminMiddleware,updateCourse);
router.delete('/delete/:courseId',adminMiddleware, deleteCourse);

router.get('/courses', getCourse);
router.get("/:coureseId",courseDetails);

router.get("/buy/:courseId",userMiddleware,buyCourses)




export default router;
