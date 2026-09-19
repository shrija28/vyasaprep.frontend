import requests

BASE_URL = "http://127.0.0.1:8000"

def test_exam_fields():
    print("Testing exam metadata payload fields...")
    session = requests.Session()
    
    # 1. Login as institution admin
    login_res = session.post(f"{BASE_URL}/api/auth/institution/login", json={
        "email": "testinst@example.com",
        "password": "password123"
    })
    print(f"Inst login status: {login_res.status_code}")
    
    if login_res.status_code == 200:
        # Create an exam with duration 45 mins, 50 marks, 20 questions
        create_res = session.post(f"{BASE_URL}/api/institution/content/exams", json={
            "exam_name": "Test Physics Exam",
            "subject": "Physics",
            "duration_minutes": 45,
            "total_marks": 50,
            "question_count": 20,
            "is_published": True
        })
        print(f"Create exam status: {create_res.status_code}, response: {create_res.json()}")

if __name__ == "__main__":
    test_exam_fields()
