from flask import Flask, render_template, request, jsonify, Response
import cv2
import numpy as np
import os
import time

app = Flask(__name__)

# Define base directory for model files
base_dir = r"D:\SOFTWARE_PROJECT\Finnale"

# Define model file paths
faceProto = os.path.join(base_dir, "opencv_face_detector.pbtxt")
faceModel = os.path.join(base_dir, "opencv_face_detector_uint8.pb")
ageProto = os.path.join(base_dir, "age_deploy.prototxt")
ageModel = os.path.join(base_dir, "age_net.caffemodel")
genderProto = os.path.join(base_dir, "gender_deploy.prototxt")
genderModel = os.path.join(base_dir, "gender_net.caffemodel")

# Load the models
faceNet = cv2.dnn.readNet(faceModel, faceProto)
ageNet = cv2.dnn.readNet(ageModel, ageProto)
genderNet = cv2.dnn.readNet(genderModel, genderProto)

# Constants for model input
MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
ageList = ['0-5', '5-10', '10-15', '15-20', '20-25', '25-30', '30-35', '35-40',
           '40-45', '45-50', '50-55', '55-60', '60-65', '65-70', '70-75', '75-80',
           '80-85', '85-90', '90-95', '95-100']
genderList = ['Male', 'Female']

def detect_age_gender(frame):
    """Detect age and gender from a given frame."""
    frameHeight, frameWidth = frame.shape[:2]

    # Preprocess image for face detection
    blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), [104, 117, 123], True, False)
    faceNet.setInput(blob)
    detections = faceNet.forward()

    results = []

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.7:  # Confidence threshold
            # Extract bounding box coordinates
            x1 = int(detections[0, 0, i, 3] * frameWidth)
            y1 = int(detections[0, 0, i, 4] * frameHeight)
            x2 = int(detections[0, 0, i, 5] * frameWidth)
            y2 = int(detections[0, 0, i, 6] * frameHeight)

            # Extract face region
            face = frame[max(0, y1):min(y2, frame.shape[0] - 1),
                         max(0, x1):min(x2, frame.shape[1] - 1)]

            # Prepare blob for age and gender prediction
            blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)

            # Predict gender
            genderNet.setInput(blob)
            genderPreds = genderNet.forward()
            gender = genderList[genderPreds[0].argmax()]

            # Predict age
            ageNet.setInput(blob)
            agePreds = ageNet.forward()
            age = ageList[agePreds[0].argmax()]

            results.append({"age": age, "gender": gender, "box": [x1, y1, x2, y2]})

    return results

def generate_frames():
    """Generate frames from webcam for real-time detection with reduced FPS."""
    cap = cv2.VideoCapture(0)
    last_update_time = time.time()

    while True:
        success, frame = cap.read()
        if not success:
            break

        # Reduce FPS to 5 by updating frame every 0.2 seconds
        if time.time() - last_update_time > 0.2:
            last_update_time = time.time()
            results = detect_age_gender(frame)

            # Draw bounding boxes and labels
            for result in results:
                x1, y1, x2, y2 = result["box"]
                gender = result["gender"]
                age = result["age"]

                # Draw bounding box
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                # Display gender and age
                font = cv2.FONT_HERSHEY_TRIPLEX
                font_scale = 0.7
                thickness = 2
                text = f"{gender}, "
                text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]
                cv2.putText(frame, text, (x1, y1 - 10), font, font_scale, (255, 255, 255), thickness, cv2.LINE_AA)
                cv2.putText(frame, age, (x1 + text_size[0], y1 - 10), font, font_scale, (0, 255, 0), thickness, cv2.LINE_AA)

            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/try')
def try_page():
    """Render the real-time try page."""
    return render_template('try.html')

@app.route('/pic')
def pic_page():
    """Render the image upload page."""
    return render_template('pic.html')

@app.route('/video_feed')
def video_feed():
    """Stream video frames with age and gender detection."""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/upload', methods=['POST'])
def upload_image():
    """Handle image upload and return age-gender predictions."""
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Read image as OpenCV format
    npimg = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Predict age and gender
    results = detect_age_gender(frame)

    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)