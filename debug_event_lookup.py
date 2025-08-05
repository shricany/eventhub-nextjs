import requests

BASE_URL = "https://eventhub-nextjs-three.vercel.app"

def debug_event_lookup():
    print("Debug Event Lookup")
    print("=" * 20)
    
    # Get all events
    response = requests.get(f"{BASE_URL}/api/events")
    if response.status_code == 200:
        events = response.json()
        print(f"Found {len(events)} events:")
        for event in events[:3]:  # Show first 3
            print(f"  ID: {event['id']}, Name: {event['name']}")
        
        if events:
            event_id = events[0]['id']
            print(f"\nTesting event ID {event_id}...")
            
            # Try to get comments for this event (this will test getEventById internally)
            response = requests.get(f"{BASE_URL}/api/events/comments?eventId={event_id}")
            print(f"Comments API: {response.status_code}")
            if response.status_code != 200:
                print(f"Error: {response.text}")
            else:
                comments = response.json()
                print(f"Comments found: {len(comments)}")
    else:
        print(f"Failed to get events: {response.status_code}")

if __name__ == "__main__":
    debug_event_lookup()