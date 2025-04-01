import unittest
import cv2
import numpy as np
import os
from app import app, detect_age_gender, faceNet, ageNet, genderNet

class TestAgeGenderDetection(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.test_image_path = "static\\Tanmai.jpeg"  # Ensure you have a test image in the directory
    
    def test_model_loading(self):
        """Test if models are loaded properly."""
        self.assertIsNotNone(faceNet, "Face detection model not loaded")
        self.assertIsNotNone(ageNet, "Age detection model not loaded")
        self.assertIsNotNone(genderNet, "Gender detection model not loaded")
    
    def test_face_detection(self):
        """Test if face detection works with a sample image."""
        img = cv2.imread(self.test_image_path)  # Sample test image
        results = detect_age_gender(img)
        self.assertTrue(len(results) > 0, "No faces detected in the image")
    
    def test_age_gender_prediction(self):
        """Test if the age and gender prediction are returned."""
        img = cv2.imread("static/gngng.jpeg")
        results = detect_age_gender(img)
        for result in results:
            self.assertIn(result['age'], [f'{i}-{i+5}' for i in range(0, 100, 5)], "Invalid age range")
            self.assertIn(result['gender'], ['Male', 'Female'], "Invalid gender value")
    
    def test_no_face(self):
        """Test handling of images with no faces."""
        img = np.zeros((300, 300, 3), dtype=np.uint8)  # Black image with no face
        results = detect_age_gender(img)
        self.assertEqual(len(results), 0, "False detection in blank image")
    
    def test_video_capture(self):
        """Test if video capture is functional."""
        cap = cv2.VideoCapture(0)
        ret, _ = cap.read()
        cap.release()
        self.assertTrue(ret, "Video capture failed")
        
    def test_video_feed(self):
        """Test if the /video_feed endpoint returns a streaming response."""
        response = self.client.get('/video_feed')
        self.assertEqual(response.status_code, 200, "Video feed endpoint failed")
    
        # Check if mimetype starts with 'multipart/x-mixed-replace'
        self.assertTrue(response.mimetype.startswith('multipart/x-mixed-replace'), "Incorrect MIME type")

if __name__ == '__main__':
    unittest.main()
