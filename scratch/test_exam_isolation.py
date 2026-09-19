import requests

BASE_URL = "http://127.0.0.1:8000"

def test_exam_isolation():
    print("Testing exam isolation...")
    session = requests.Session()
    
    # Unauthenticated exam list check (should be 401)
    res = session.get(f"{BASE_URL}/api/student/exams")
    print(f"Unauthenticated /api/student/exams status: {res.status_code}")

if __name__ == "__main__":
    test_exam_isolation()
