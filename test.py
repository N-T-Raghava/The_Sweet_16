import unittest
import cv2
import numpy as np
import os
from app import app, detect_age_gender, faceNet, ageNet, genderNet

class TestAgeGenderDetection(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.test_image_path = "static/Tanmai.jpeg"  # Ensure you have a test image in the directory

    def setUp(self):
        """Set up test client before each test."""
        self.app = app.test_client()  # Initialize the test client
        self.app.testing = True  # Enable testing mode
    
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
        if 'CI' in os.environ:
            print("Skipping video capture test in CI environment")
            return  # Skip test in CI

        cap = cv2.VideoCapture(0)  # Open default camera
        ret, frame = cap.read()  # Read frame
        cap.release()  # Release camera

        if not ret:
            self.fail("Video capture failed. No frame was captured.")
    
    def test_video_feed(self):
        """Test if the /video_feed endpoint returns a streaming response."""
        response = self.client.get('/video_feed')
        self.assertEqual(response.status_code, 200, "Video feed endpoint failed")
        self.assertTrue(response.mimetype.startswith('multipart/x-mixed-replace'), "Incorrect MIME type")

    def test_index_page(self):
        """Test if index.html loads successfully."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<title>Age Prediction - The Sweet 16</title>', response.data)

    def test_try_page(self):
        """Test if try.html loads successfully."""
        response = self.client.get('/try')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<title>Live Age & Gender Detection</title>', response.data)

    def test_pic_page(self):
        """Test if pic.html loads successfully."""
        response = self.client.get('/pic')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<title>Upload Image - Age and Gender Prediction</title>', response.data)

    def test_nav_hamburger(self):
        """Test if the hamburger menu exists in index.html."""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('<div class="hamburger" onclick="toggleMenu()">☰</div>'.encode('utf-8'), response.data)

    def test_index_links(self):
        """Test if all navigation links exist on index.html."""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<a href="#qa">Q&A</a>', response.data)

    def test_upload_form(self):
        """Test if the upload form exists in pic.html."""
        response = self.client.get('/pic')
        self.assertIn(b'<form id="uploadForm">', response.data)
        self.assertIn(b'<input type="file"', response.data)
        self.assertIn(b'<button type="submit">Predict</button>', response.data)

    def test_js_inclusion(self):
        """Test if JavaScript files are included in index.html."""
        response = self.client.get('/')
        self.assertIn(b'<script src="static/script.js"></script>', response.data)
    
    def test_css_inclusion(self):
        """Test if CSS files are included in index.html."""
        response = self.client.get('/')
        self.assertIn(b'<link rel="stylesheet" href="static/style.css" />', response.data)
    
    def test_faq_toggle(self):
        """Test if FAQ toggle buttons exist in index.html."""
        response = self.client.get('/')
        self.assertIn(b'<button class="toggle-btn">+</button>', response.data)
    
    def test_team_section(self):
        """Test if the team section contains the expected team members."""
        response = self.client.get('/')
        self.assertIn(b'<h3>Tanmai Raghava</h3>', response.data)
        self.assertIn(b'<h3>Yesheeth Chintada</h3>', response.data)

    def test_live_video_toggle(self):
        """Test if the Start Detection button exists in try.html."""
        response = self.client.get('/try')
        self.assertIn(b'<button id="startButton" onclick="toggleVideo()">Start Detection</button>', response.data)

if __name__ == '__main__':
    unittest.main()
