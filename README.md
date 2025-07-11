# AI Travel Itinerary Planner

A web application that uses AI to generate custom travel itineraries based on your destination, number of days, and activity preferences. Seamlessly integrates Google Maps for location input and displays clean, copyable itineraries in real-time.

---

## Demo Input

Enter example values on the homepage to see how it works:

- **Destination:** `Oregon`  
- **Days:** `3`  
- **Preferences:** `Hiking, Nature, Local Food`

---

## Features

- **AI-generated itineraries** tailored to your travel preferences
- Google Maps **Places Autocomplete** for easy location entry
- Styled Markdown rendering with **copy-to-clipboard** support
- Dynamic UI with **loading indicators** and conditional rendering
- Built-in **Redis caching** to reduce API load and boost performance

---

## How to Use

### Generate an Itinerary
1. Enter your **destination**, **number of days**, and **preferences**.
2. Click **"Generate Itinerary"**.
3. View your AI-generated travel plan styled in a code-like container.

### Copy the Plan
- Click the **"Copy"** button on the top right of the itinerary to copy it to your clipboard.

---

## Tech Stack

- React (TypeScript)
- OpenAI GPT API
- Google Maps API (Places Autocomplete)
- Node.js (Express)
- Redis (for caching)
- Docker & Docker Compose
