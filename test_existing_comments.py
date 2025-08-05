import requests

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def test_existing_comments():
    print("Testing Existing Comments Display")
    print("=" * 35)
    
    # Get events
    response = requests.get(f"{BASE_URL}/api/events")
    events = response.json()
    
    for event in events[:3]:
        event_id = event['id']
        print(f"\nEvent {event_id}: {event['name']}")
        
        # Get comments for this event
        response = requests.get(f"{BASE_URL}/api/events/comments?eventId={event_id}")
        print(f"  API Status: {response.status_code}")
        
        if response.status_code == 200:
            comments = response.json()
            print(f"  Comments found: {len(comments)}")
            
            for comment in comments:
                print(f"    - {comment.get('name', 'Unknown')}: {comment.get('comment', 'No text')[:30]}...")
        else:
            print(f"  Error: {response.text}")

if __name__ == "__main__":
    test_existing_comments()