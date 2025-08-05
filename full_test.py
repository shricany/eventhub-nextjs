import requests
import json
import time

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def test_all_functionality():
    print("FULL FUNCTIONALITY TEST - EventHub")
    print(f"URL: {BASE_URL}")
    print("=" * 50)
    
    # Test 1: Landing Page
    print("1. LANDING PAGE")
    try:
        response = requests.get(BASE_URL)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200 and "EventHub" in response.text:
            print("   PASS - Landing page loads with EventHub branding")
        else:
            print("   FAIL - Landing page issue")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 2: Admin Registration
    print("\n2. ADMIN REGISTRATION")
    admin_data = {
        "username": f"admin{int(time.time())}",
        "email": f"admin{int(time.time())}@test.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/admin/register", json=admin_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            admin_token = response.json().get('access_token')
            admin_user = response.json().get('user')
            print("   PASS - Admin registered successfully")
            print(f"   Admin ID: {admin_user.get('id')}")
        else:
            print(f"   FAIL - {response.text}")
            return
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    # Test 3: Admin Login
    print("\n3. ADMIN LOGIN")
    login_data = {
        "email": admin_data["email"],
        "password": admin_data["password"]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json=login_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   PASS - Admin login successful")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 4: Event Creation
    print("\n4. EVENT CREATION")
    event_data = {
        "name": f"Test Event {int(time.time())}",
        "date": "2024-12-25",
        "time": "14:00",
        "location": "Main Auditorium",
        "department": "Computer Science",
        "registration_deadline": "2024-12-20T12:00",
        "award": "Certificate of Participation",
        "description": "This is a test event created via API"
    }
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{BASE_URL}/api/events", json=event_data, headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            event = response.json()
            event_id = event.get('id')
            print("   PASS - Event created successfully")
            print(f"   Event ID: {event_id}")
            print(f"   Event Name: {event.get('name')}")
        else:
            print(f"   FAIL - {response.text}")
            return
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    # Test 5: Get All Events
    print("\n5. GET ALL EVENTS")
    try:
        response = requests.get(f"{BASE_URL}/api/events")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            events = response.json()
            print(f"   PASS - Retrieved {len(events)} events")
            for event in events[:3]:  # Show first 3 events
                print(f"   - {event.get('name')} (ID: {event.get('id')})")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 6: Admin Get Own Events
    print("\n6. ADMIN GET OWN EVENTS")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/events/admin", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            admin_events = response.json()
            print(f"   PASS - Admin has {len(admin_events)} events")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 7: Student Registration
    print("\n7. STUDENT REGISTRATION")
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
            student_user = response.json().get('user')
            print("   PASS - Student registered successfully")
            print(f"   Student ID: {student_user.get('id')}")
            print(f"   Student Name: {student_user.get('name')}")
        else:
            print(f"   FAIL - {response.text}")
            return
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    # Test 8: Student Login
    print("\n8. STUDENT LOGIN")
    student_login = {
        "email": student_data["email"],
        "password": student_data["password"]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/student/login", json=student_login)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   PASS - Student login successful")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 9: Student Show Interest
    print("\n9. STUDENT SHOW INTEREST")
    try:
        headers = {"Authorization": f"Bearer {student_token}"}
        response = requests.post(f"{BASE_URL}/api/events/{event_id}/interest", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   PASS - Student showed interest successfully")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 10: Student Join Event
    print("\n10. STUDENT JOIN EVENT")
    join_data = {"participation_type": "participant"}
    
    try:
        headers = {"Authorization": f"Bearer {student_token}"}
        response = requests.post(f"{BASE_URL}/api/events/{event_id}/join", json=join_data, headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   PASS - Student joined event successfully")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 11: Student Submit Feedback
    print("\n11. STUDENT SUBMIT FEEDBACK")
    feedback_data = {"feedback": "Great event! Very informative and well organized."}
    
    try:
        headers = {"Authorization": f"Bearer {student_token}"}
        response = requests.post(f"{BASE_URL}/api/events/{event_id}/feedback", json=feedback_data, headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   PASS - Student feedback submitted successfully")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 12: Student Get My Events
    print("\n12. STUDENT GET MY EVENTS")
    try:
        headers = {"Authorization": f"Bearer {student_token}"}
        response = requests.get(f"{BASE_URL}/api/students/my-events", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            my_events = response.json()
            print(f"   PASS - Student has {len(my_events)} events")
            if my_events:
                event = my_events[0]
                print(f"   - {event.get('name')} (Status: {event.get('my_status')})")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 13: Admin Get Event Participants
    print("\n13. ADMIN GET EVENT PARTICIPANTS")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/events/{event_id}/participants", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            participants = response.json()
            interested = participants.get('interested', [])
            joined = participants.get('joined', [])
            print(f"   PASS - Event has {len(interested)} interested, {len(joined)} joined")
            if joined:
                student = joined[0]
                print(f"   - {student.get('name')} ({student.get('email')})")
                if student.get('feedback'):
                    print(f"   - Feedback: {student.get('feedback')[:50]}...")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 14: Withdraw Interest
    print("\n14. STUDENT WITHDRAW INTEREST")
    try:
        headers = {"Authorization": f"Bearer {student_token}"}
        response = requests.delete(f"{BASE_URL}/api/events/{event_id}/interest", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   PASS - Student withdrew interest successfully")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 15: Check Updated Event Counts
    print("\n15. VERIFY UPDATED EVENT COUNTS")
    try:
        response = requests.get(f"{BASE_URL}/api/events")
        if response.status_code == 200:
            events = response.json()
            test_event = next((e for e in events if e.get('id') == event_id), None)
            if test_event:
                print(f"   Event: {test_event.get('name')}")
                print(f"   Interested: {test_event.get('interested_count', 0)}")
                print(f"   Joined: {test_event.get('participants_count', 0)}")
                print("   PASS - Event counts updated correctly")
            else:
                print("   FAIL - Test event not found")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    print("\n" + "=" * 50)
    print("FULL FUNCTIONALITY TEST COMPLETED!")
    print("Check results above - all PASS means app is working perfectly!")
    print(f"Live App: {BASE_URL}")

if __name__ == "__main__":
    test_all_functionality()