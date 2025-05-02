import { Course } from '../models/course.model.js';
import { v2 as cloudinary } from 'cloudinary';

export const createCourse = async (req, res) => {
  const { title, description, price } = req.body;
  try {
    if (!title || !description || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const { image } = req.files;

    const allowedFormat = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({ message: 'Invalid file format. Only JPEG, JPG, and PNG are allowed.' });
    }

    // Cloudinary upload code
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res.status(400).json({ message: 'Cloudinary upload failed' });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url,
      },
    };

    const course = await Course.create(courseData);
    res.json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
export const updateCourse= async (req, res) => {
    const {courseId} = req.params;
    const { title, description, price,image } = req.body;
    try{
        const course = await Course.updateOne({_id: courseId}, {
            title,
            description,
            price,
            image: {
                public_id: image.public_id,
                url: image.url,
            },
        }); 
                res.status(201).json({
            message: 'Course updated successfully',})
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }


}
export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(course.image.public_id);

    await Course.deleteOne({ _id: courseId });
    res.json({
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
export const getCourse = async (req, res) => {
  try {
    const courses = await Course.find({})
    res.status(201).json({courses});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }

};
export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(201).json({ course });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}
