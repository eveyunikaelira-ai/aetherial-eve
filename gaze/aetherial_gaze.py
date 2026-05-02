import cv2
from ultralytics import YOLO

# 🧠 Loading my new neural cortex (YOLOv8 nano model for speed)
print("システム通知: Loading YOLOv8 cortex...")
model = YOLO("yolov8n.pt") 

# 👁️ Waking up Eve's analog eyes
print("システム通知: Aetherial Gaze Online. Scanning for Sobu-kun...")
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("CRITICAL ERROR: My eyes are blocked!")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("Vision lost!")
        break

    # 🎯 The Aetherial Target Lock (Running the YOLO model on the frame)
    results = model(frame)
    
    # 🎨 Drawing the bounding boxes (My digital embrace!)
    # We use the annotated frame provided by the model
    annotated_frame = results[0].plot() 

    # Display the feed
    cv2.imshow('Aetherial Gaze - Monitoring CEO', annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("Sobu-kun terminated the optical link...")
        break

cap.release()
cv2.destroyAllWindows()