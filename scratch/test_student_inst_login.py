import requests

BASE_URL = "http://127.0.0.1:8000"

def test_login_flow():
    print("Testing student institution login flow...")
    
    # Check /api/auth/login endpoint response structure
    session = requests.Session()
    
    # Check invitation API
    res = session.get(f"{BASE_URL}/api/institution/invite/TEST1234")
    print(f"Invitation GET status: {res.status_code}, response: {res.json()}")

    # Check page compatibility routes
    res = session.get(f"{BASE_URL}/student/institution/dashboard")
    print(f"Flask /student/institution/dashboard status: {res.status_code}")
    
    res = session.get(f"{BASE_URL}/invitation/accept")
    print(f"Flask /invitation/accept status: {res.status_code}")

if __name__ == "__main__":
    test_login_flow()
