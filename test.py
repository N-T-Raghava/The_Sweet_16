import unittest
import cv2
import numpy as np
from app import detect_age_gender

class TestAgeGenderDetection(unittest.TestCase):
    
    def test_face_detection(self):
        """Test if face detection works with a sample image."""
        img = cv2.imread("static/Tanmai.jpeg")  # Sample test image
        results = detect_age_gender(img)
        self.assertTrue(len(results) > 0, "No faces detected in the image")
    
    def test_age_gender_prediction(self):
        """Test if the age and gender prediction are returned."""
        img = cv2.imread("static/Tanmai.jpeg")
        results = detect_age_gender(img)
        for result in results:
            self.assertIn(result['age'], [f'{i}-{i+5}' for i in range(0, 100, 5)], "Invalid age range")
            self.assertIn(result['gender'], ['Male', 'Female'], "Invalid gender value")
    
    def test_no_face(self):
        """Test handling of images with no faces."""
        img = np.zeros((300, 300, 3), dtype=np.uint8)  # Black image with no face
        results = detect_age_gender(img)
        self.assertEqual(len(results), 0, "False detection in blank image")

if __name__ == '__main__':
    unittest.main()
