import requests
import time

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def test_database_structure():
    print("Testing Database Structure")
    print("=" * 30)
    
    # First, trigger database initialization by calling any API
    print("1. Triggering database initialization...")
    response = requests.get(f"{BASE_URL}/api/events")
    print(f"   Events API: {response.status_code}")
    
    # Test comments table by trying to get comments
    print("\n2. Testing comments table...")
    response = requests.get(f"{BASE_URL}/api/events/comments?eventId=1")
    print(f"   Comments GET: {response.status_code}")
    if response.status_code == 200:
        comments = response.json()
        print(f"   Comments found: {len(comments)}")
    else:
        print(f"   Error: {response.text}")
    
    # Register a student and try to add a comment
    print("\n3. Testing comment insertion...")
    student_data = {
        "name": f"DB Test Student {int(time.time())}",
        "email": f"dbtest{int(time.time())}@test.com",
        "password": "password123",
        "department": "Computer Science",
        "year": "3"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/student/register", json=student_data)
    if response.status_code == 201:
        token = response.json().get('access_token')
        print("   Student registered successfully")
        
        # Try to add comment
        comment_data = {"comment": f"DB structure test comment {int(time.time())}"}
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        response = requests.post(f"{BASE_URL}/api/events/comments?eventId=1", json=comment_data, headers=headers)
        
        print(f"   Comment POST: {response.status_code}")
        if response.status_code != 201:
            print(f"   Error: {response.text}")
        else:
            print("   Comment added successfully")
            
            # Immediately check if it's there
            response = requests.get(f"{BASE_URL}/api/events/comments?eventId=1")
            if response.status_code == 200:
                comments = response.json()
                print(f"   Comments after insertion: {len(comments)}")
                if comments:
                    print(f"   Latest comment: {comments[0]['comment'][:50]}...")
            else:
                print(f"   Failed to retrieve comments: {response.text}")
    else:
        print(f"   Failed to register student: {response.status_code}")

if __name__ == "__main__":
    test_database_structure()