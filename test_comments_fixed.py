import requests
import json
import time

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def test_comments():
    print("Testing Fixed Comments Feature")
    print("=" * 40)
    
    # Step 1: Register a student
    print("1. Registering test student...")
    student_data = {
        "name": f"Test Student {int(time.time())}",
        "email": f"student{int(time.time())}@test.com",
        "password": "password123",
        "department": "Computer Science",
        "year": "3"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/student/register", json=student_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            student_token = response.json().get('access_token')
            print("   PASS - Student registered")
        else:
            print(f"   FAIL - {response.text}")
            return
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    # Step 2: Get events
    print("\n2. Getting events...")
    try:
        response = requests.get(f"{BASE_URL}/api/events")
        if response.status_code == 200:
            events = response.json()
            if events:
                event_id = events[0]['id']
                print(f"   PASS - Using event ID: {event_id}")
            else:
                print("   FAIL - No events found")
                return
        else:
            print(f"   FAIL - {response.text}")
            return
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    # Step 3: Test new API path - Get comments
    print("\n3. Testing new API path - Get comments...")
    try:
        response = requests.get(f"{BASE_URL}/api/events/comments?eventId={event_id}")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            existing_comments = response.json()
            print(f"   PASS - Found {len(existing_comments)} existing comments")
        else:
            print(f"   FAIL - {response.text}")
            return
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    # Step 4: Add a comment with new API
    print("\n4. Adding comment with new API...")
    comment_data = {
        "comment": f"Fixed API test comment at {time.strftime('%Y-%m-%d %H:%M:%S')}"
    }
    
    try:
        headers = {"Authorization": f"Bearer {student_token}", "Content-Type": "application/json"}
        response = requests.post(f"{BASE_URL}/api/events/comments?eventId={event_id}", json=comment_data, headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            print("   PASS - Comment added successfully!")
        else:
            print(f"   FAIL - {response.text}")
            return
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    # Step 5: Verify comment was added
    print("\n5. Verifying comment was added...")
    try:
        response = requests.get(f"{BASE_URL}/api/events/comments?eventId={event_id}")
        if response.status_code == 200:
            new_comments = response.json()
            if len(new_comments) > len(existing_comments):
                print(f"   PASS - Comment count increased from {len(existing_comments)} to {len(new_comments)}")
                latest_comment = new_comments[0]
                print(f"   Latest comment: {latest_comment['comment'][:50]}...")
                print(f"   By: {latest_comment['name']} ({latest_comment['department']})")
            else:
                print("   FAIL - Comment count did not increase")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    print("\n" + "=" * 40)
    print("Fixed comments test completed!")

if __name__ == "__main__":
    test_comments()