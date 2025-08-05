import requests
import time

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def create_test_event():
    print("Creating Test Event for Comments")
    print("=" * 35)
    
    # Login as admin
    admin_data = {
        "username": "admin",
        "email": "admin@admin", 
        "password": "admin767"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/admin/register", json=admin_data)
    if response.status_code == 200:
        admin_token = response.json().get('access_token')
        print("1. Admin logged in successfully")
    else:
        print(f"1. Failed to login admin: {response.status_code}")
        print(response.text)
        return
    
    # Create event
    event_data = {
        "name": f"Test Event for Comments {int(time.time())}",
        "date": "2024-12-31",
        "time": "18:00",
        "location": "Test Location",
        "department": "Computer Science",
        "registration_deadline": "2024-12-30T23:59:59Z",
        "award": "Test Award",
        "description": "Test event for comments functionality"
    }
    
    headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    response = requests.post(f"{BASE_URL}/api/events", json=event_data, headers=headers)
    
    if response.status_code == 201:
        event = response.json()
        event_id = event['id']
        print(f"2. Event created successfully with ID: {event_id}")
        
        # Now test comments on this event
        print("\n3. Testing comments on new event...")
        
        # Register student
        student_data = {
            "name": f"Comment Test Student {int(time.time())}",
            "email": f"commenttest{int(time.time())}@test.com",
            "password": "password123",
            "department": "Computer Science",
            "year": "3"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/student/register", json=student_data)
        if response.status_code == 201:
            student_token = response.json().get('access_token')
            print("   Student registered")
            
            # Add comment
            comment_data = {"comment": f"Test comment on new event {int(time.time())}"}
            headers = {"Authorization": f"Bearer {student_token}", "Content-Type": "application/json"}
            response = requests.post(f"{BASE_URL}/api/events/comments?eventId={event_id}", json=comment_data, headers=headers)
            
            print(f"   Add comment: {response.status_code}")
            if response.status_code == 201:
                print("   SUCCESS - Comment added!")
                
                # Check if visible
                time.sleep(2)
                response = requests.get(f"{BASE_URL}/api/events/comments?eventId={event_id}")
                if response.status_code == 200:
                    comments = response.json()
                    print(f"   Comments found: {len(comments)}")
                    if comments:
                        print(f"   Comment: {comments[0]['comment']}")
                        print("   COMMENTS ARE WORKING!")
                    else:
                        print("   No comments found")
            else:
                print(f"   Error: {response.text}")
        else:
            print(f"   Failed to register student: {response.status_code}")
    else:
        print(f"2. Failed to create event: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    create_test_event()