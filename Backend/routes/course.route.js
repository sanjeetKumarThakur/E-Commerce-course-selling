import express from 'express';
import { createCourse,updateCourse,deleteCourse,getCourse,courseDetails } from '../controllers/course.controllers.js';

const router = express.Router();
router.post('/create', createCourse);
router.put("/update/:courseId", updateCourse);
router.delete('/delete/:courseId', deleteCourse);
router.get('/courses', getCourse);
router.get("/:coureseId",courseDetails)

export default router;
