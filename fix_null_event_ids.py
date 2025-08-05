import requests
import time

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def test_comment_with_proper_ids():
    print("Testing Comment with Proper IDs")
    print("=" * 35)
    
    # Get events
    response = requests.get(f"{BASE_URL}/api/events")
    events = response.json()
    event_id = events[0]['id']
    print(f"Using event ID: {event_id} (type: {type(event_id)})")
    
    # Register student
    student_data = {
        "name": f"ID Fix Test {int(time.time())}",
        "email": f"idfix{int(time.time())}@test.com",
        "password": "password123",
        "department": "Computer Science",
        "year": "3"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/student/register", json=student_data)
    token = response.json().get('access_token')
    print("Student registered")
    
    # Add comment with explicit integer event ID
    comment_data = {"comment": f"ID fix test comment {int(time.time())}"}
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    print(f"Posting to: /api/events/comments?eventId={event_id}")
    response = requests.post(f"{BASE_URL}/api/events/comments?eventId={event_id}", json=comment_data, headers=headers)
    
    print(f"Comment POST: {response.status_code}")
    if response.status_code == 201:
        print("Comment added successfully!")
        
        # Check if it appears
        time.sleep(2)
        response = requests.get(f"{BASE_URL}/api/events/comments?eventId={event_id}")
        if response.status_code == 200:
            comments = response.json()
            print(f"Comments retrieved: {len(comments)}")
            if comments:
                print(f"Latest comment: {comments[0]['comment']}")
                print("SUCCESS - Comments are working!")
            else:
                print("FAIL - No comments found")
        else:
            print(f"Failed to get comments: {response.status_code}")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    test_comment_with_proper_ids()