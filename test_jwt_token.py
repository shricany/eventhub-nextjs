import requests
import time

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def test_jwt_token():
    print("Testing JWT Token Contents")
    print("=" * 30)
    
    # Register student
    student_data = {
        "name": f"JWT Test {int(time.time())}",
        "email": f"jwttest{int(time.time())}@test.com",
        "password": "password123",
        "department": "Computer Science",
        "year": "3"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/student/register", json=student_data)
    if response.status_code == 201:
        token = response.json().get('access_token')
        print("Student registered successfully")
        
        # Debug user endpoint
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/debug-user", headers=headers)
        
        if response.status_code == 200:
            user_data = response.json()
            print("JWT Token Contents:")
            print(f"  User: {user_data['user']}")
            print(f"  User Keys: {user_data['userKeys']}")
            print(f"  User ID: {user_data['userId']}")
            print(f"  User ID Type: {user_data['userType']}")
        else:
            print(f"Debug failed: {response.status_code} - {response.text}")
    else:
        print(f"Registration failed: {response.status_code}")

if __name__ == "__main__":
    test_jwt_token()