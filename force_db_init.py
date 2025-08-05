import requests

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def force_database_init():
    print("Forcing Database Initialization")
    print("=" * 35)
    
    # Call the manual init endpoint
    print("1. Calling manual database init...")
    response = requests.post(f"{BASE_URL}/api/init-db")
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   SUCCESS - Database initialized")
    else:
        print(f"   ERROR: {response.text}")
    
    # Test comments table after init
    print("\n2. Testing comments table...")
    response = requests.get(f"{BASE_URL}/api/events/comments?eventId=1")
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   SUCCESS - Comments table accessible")
    else:
        print(f"   ERROR: {response.text}")

if __name__ == "__main__":
    force_database_init()