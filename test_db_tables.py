import requests

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def test_database_tables():
    print("Testing Database Tables")
    print("=" * 30)
    
    # Test if events API works (this will trigger initDatabase)
    print("1. Testing events API (triggers DB init)...")
    try:
        response = requests.get(f"{BASE_URL}/api/events")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   PASS - Events API works, DB initialized")
        else:
            print(f"   FAIL - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test comments API without authentication (should work for GET)
    print("\n2. Testing comments GET API...")
    try:
        response = requests.get(f"{BASE_URL}/api/events/comments?eventId=1")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   PASS - Comments table exists and accessible")
        elif response.status_code == 500:
            print("   FAIL - Comments table might not exist")
            print(f"   Response: {response.text}")
        else:
            print(f"   Status: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")

if __name__ == "__main__":
    test_database_tables()