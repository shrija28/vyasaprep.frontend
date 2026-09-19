import requests

BASE_URL = "http://127.0.0.1:8000"

def test_student_exams_api():
    print("Testing /api/student/exams endpoint...")
    session = requests.Session()
    
    # Check response when not authenticated
    res = session.get(f"{BASE_URL}/api/student/exams")
    print(f"Unauthenticated status: {res.status_code}, response: {res.json()}")

if __name__ == "__main__":
    test_student_exams_api()
