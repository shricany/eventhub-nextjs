import requests

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def create_comments_table():
    print("Creating Comments Table")
    print("=" * 25)
    
    response = requests.post(f"{BASE_URL}/api/create-comments-table")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("SUCCESS - Comments table created!")
        print(f"Message: {result['message']}")
        print(f"Current count: {result['count']}")
    else:
        print("FAILED to create comments table")
        print(f"Error: {response.text}")

if __name__ == "__main__":
    create_comments_table()