import requests
import time

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def test_comments_final():
    print("Final Comments Test")
    print("=" * 25)
    
    # Get available events
    print("1. Getting available events...")
    response = requests.get(f"{BASE_URL}/api/events")
    if response.status_code == 200:
        events = response.json()
        if events:
            event_id = events[0]['id']
            print(f"   Using event ID: {event_id}")
        else:
            print("   No events found")
            return
    else:
        print(f"   Failed to get events: {response.status_code}")
        return
    
    # Register student
    student_data = {
        "name": f"Final Test Student {int(time.time())}",
        "email": f"finaltest{int(time.time())}@test.com",
        "password": "password123",
        "department": "Computer Science",
        "year": "3"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/student/register", json=student_data)
    if response.status_code == 201:
        token = response.json().get('access_token')
        print("2. Student registered successfully")
    else:
        print(f"2. Failed to register student: {response.status_code}")
        return
    
    # Check initial comments
    response = requests.get(f"{BASE_URL}/api/events/comments?eventId={event_id}")
    initial_count = len(response.json()) if response.status_code == 200 else 0
    print(f"3. Initial comments: {initial_count}")
    
    # Add comment
    comment_data = {"comment": f"Final test comment {int(time.time())}"}
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    response = requests.post(f"{BASE_URL}/api/events/comments?eventId={event_id}", json=comment_data, headers=headers)
    
    print(f"4. Add comment: {response.status_code}")
    if response.status_code == 201:
        print("   Comment added successfully!")
        
        # Check comments after adding
        time.sleep(2)
        response = requests.get(f"{BASE_URL}/api/events/comments?eventId={event_id}")
        if response.status_code == 200:
            final_comments = response.json()
            print(f"5. Final comments: {len(final_comments)}")
            if len(final_comments) > initial_count:
                print("   SUCCESS - Comment is visible!")
                print(f"   Comment: {final_comments[0]['comment']}")
                print(f"   By: {final_comments[0]['name']}")
            else:
                print("   FAIL - Comment not visible")
        else:
            print(f"   Failed to get comments: {response.status_code}")
    else:
        print(f"   Error: {response.text}")

if __name__ == "__main__":
    test_comments_final()