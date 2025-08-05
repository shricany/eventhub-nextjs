import requests
import json
import time

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def test_comments_detailed():
    print("Detailed Comments Test")
    print("=" * 30)
    
    # Register student
    student_data = {
        "name": f"Test Student {int(time.time())}",
        "email": f"student{int(time.time())}@test.com",
        "password": "password123",
        "department": "Computer Science",
        "year": "3"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/student/register", json=student_data)
    if response.status_code != 201:
        print("Failed to register student")
        return
    
    student_token = response.json().get('access_token')
    print("PASS - Student registered")
    
    # Get events
    response = requests.get(f"{BASE_URL}/api/events")
    events = response.json()
    event_id = events[0]['id']
    print(f"PASS - Using event ID: {event_id}")
    
    # Check initial comments
    response = requests.get(f"{BASE_URL}/api/events/comments?eventId={event_id}")
    initial_comments = response.json()
    print(f"Initial comments: {len(initial_comments)}")
    
    # Add comment
    comment_data = {"comment": f"Test comment at {time.strftime('%H:%M:%S')}"}
    headers = {"Authorization": f"Bearer {student_token}", "Content-Type": "application/json"}
    response = requests.post(f"{BASE_URL}/api/events/comments?eventId={event_id}", json=comment_data, headers=headers)
    
    if response.status_code == 201:
        print("PASS - Comment added successfully")
        
        # Wait and check multiple times
        for i in range(5):
            time.sleep(1)
            response = requests.get(f"{BASE_URL}/api/events/comments?eventId={event_id}")
            current_comments = response.json()
            print(f"   Check {i+1}: {len(current_comments)} comments")
            
            if len(current_comments) > len(initial_comments):
                print("PASS - Comment is now visible!")
                latest = current_comments[0]
                print(f"   Latest: {latest['comment']}")
                print(f"   By: {latest['name']}")
                return
        
        print("FAIL - Comment still not visible after 5 seconds")
    else:
        print(f"FAIL - Failed to add comment: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_comments_detailed()