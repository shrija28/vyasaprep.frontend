import requests

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    session = requests.Session()
    
    # 1. No Cookie
    res1 = session.get(f"{BASE_URL}/api/student/exams")
    print(f"1. No Cookie -> Status: {res1.status_code}, Body: {res1.text}")
    
    # 2. Login as institution admin
    res2_login = session.post(f"{BASE_URL}/api/auth/institution/login", json={"email": "testinst@example.com", "password": "password123"})
    print(f"2. Inst Login -> Status: {res2_login.status_code}")
    res2 = session.get(f"{BASE_URL}/api/student/exams")
    print(f"2. Inst Admin Cookie -> Status: {res2.status_code}, Body: {res2.text}")
    
    # 3. Register & Login as student
    reg_res = session.post(f"{BASE_URL}/api/auth/register", json={
        "display_name": "Test Student",
        "email": "teststudent_diag@example.com",
        "password": "password123",
        "role": "student"
    })
    login_res = session.post(f"{BASE_URL}/api/auth/login", json={
        "email": "teststudent_diag@example.com",
        "password": "password123"
    })
    print(f"3. Student Login -> Status: {login_res.status_code}")
    res3 = session.get(f"{BASE_URL}/api/student/exams")
    print(f"3. Student Cookie -> Status: {res3.status_code}, Body: {res3.text}")

if __name__ == "__main__":
    test_api()
