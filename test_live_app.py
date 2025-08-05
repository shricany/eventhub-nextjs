#!/usr/bin/env python3
"""
Test script for EventHub live app
Tests all major functionality including database operations
"""

import requests
import json
import time

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def test_app():
    print("Testing EventHub Live App")
    print(f"URL: {BASE_URL}")
    print("-" * 50)
    
    # Test 1: Landing page
    print("1. Testing landing page...")
    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            print("✓ Landing page loads successfully")
        else:
            print(f"X Landing page failed: {response.status_code}")
    except Exception as e:
        print(f"X Landing page error: {e}")
    
    # Test 2: Admin registration (database test)
    print("\n2. Testing admin registration (database)...")
    admin_data = {
        "username": "testadmin123",
        "email": "admin123@test.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/admin/register", json=admin_data)
        if response.status_code == 201:
            admin_token = response.json().get('access_token')
            print("PASS Admin registration successful - Database working!")
            print(f"   Token: {admin_token[:20]}...")
        else:
            print(f"FAIL Admin registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"FAIL Admin registration error: {e}")
        return
    
    # Test 3: Event creation
    print("\n3. Testing event creation...")
    event_data = {
        "name": "Test Event 2024",
        "date": "2024-12-25",
        "time": "14:00",
        "location": "Test Auditorium",
        "department": "Computer Science",
        "registration_deadline": "2024-12-20T12:00",
        "award": "Certificate",
        "description": "Test event for API testing"
    }
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{BASE_URL}/api/events", json=event_data, headers=headers)
        if response.status_code == 201:
            event = response.json()
            event_id = event.get('id')
            print("✅ Event creation successful")
            print(f"   Event ID: {event_id}")
        else:
            print(f"❌ Event creation failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Event creation error: {e}")
        return
    
    # Test 4: Get events
    print("\n4. Testing get events...")
    try:
        response = requests.get(f"{BASE_URL}/api/events")
        if response.status_code == 200:
            events = response.json()
            print(f"✅ Get events successful - Found {len(events)} events")
        else:
            print(f"❌ Get events failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Get events error: {e}")
    
    # Test 5: Student registration
    print("\n5. Testing student registration...")
    student_data = {
        "name": "Test Student",
        "email": "student123@test.com",
        "password": "password123",
        "department": "Computer Science",
        "year": "3"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/student/register", json=student_data)
        if response.status_code == 201:
            student_token = response.json().get('access_token')
            print("✅ Student registration successful")
            print(f"   Token: {student_token[:20]}...")
        else:
            print(f"❌ Student registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Student registration error: {e}")
        return
    
    # Test 6: Student show interest
    print("\n6. Testing student interest...")
    try:
        headers = {"Authorization": f"Bearer {student_token}"}
        response = requests.post(f"{BASE_URL}/api/events/{event_id}/interest", headers=headers)
        if response.status_code == 200:
            print("✅ Student interest successful")
        else:
            print(f"❌ Student interest failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Student interest error: {e}")
    
    # Test 7: Student join event
    print("\n7. Testing student join event...")
    try:
        headers = {"Authorization": f"Bearer {student_token}"}
        join_data = {"participation_type": "participant"}
        response = requests.post(f"{BASE_URL}/api/events/{event_id}/join", json=join_data, headers=headers)
        if response.status_code == 200:
            print("✅ Student join event successful")
        else:
            print(f"❌ Student join event failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Student join event error: {e}")
    
    # Test 8: Admin get participants
    print("\n8. Testing admin get participants...")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/events/{event_id}/participants", headers=headers)
        if response.status_code == 200:
            participants = response.json()
            print("✅ Get participants successful")
            print(f"   Interested: {len(participants.get('interested', []))}")
            print(f"   Joined: {len(participants.get('joined', []))}")
        else:
            print(f"❌ Get participants failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Get participants error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Test completed! Check results above.")
    print("If all tests pass ✅, your app is working perfectly!")

if __name__ == "__main__":
    test_app()