import requests
import json

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

print("Testing EventHub Live App")
print(f"URL: {BASE_URL}")
print("-" * 40)

# Test 1: Landing page
print("1. Testing landing page...")
try:
    response = requests.get(BASE_URL)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("PASS - Landing page works")
    else:
        print("FAIL - Landing page error")
except Exception as e:
    print(f"ERROR: {e}")

# Test 2: Admin registration
print("\n2. Testing admin registration...")
admin_data = {
    "username": "testadmin456",
    "email": "admin456@test.com", 
    "password": "password123"
}

try:
    response = requests.post(f"{BASE_URL}/api/auth/admin/register", json=admin_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        print("PASS - Database connection works!")
        token = response.json().get('access_token')
        print(f"Token received: {token[:20]}...")
    else:
        print("FAIL - Database connection issue")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")

# Test 3: Get events
print("\n3. Testing get events...")
try:
    response = requests.get(f"{BASE_URL}/api/events")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        events = response.json()
        print(f"PASS - Found {len(events)} events")
    else:
        print("FAIL - Events API error")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")

print("\n" + "=" * 40)
print("Test completed!")