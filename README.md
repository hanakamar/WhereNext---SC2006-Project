# WhereNext: Find your next meal - Right next to you!
![Find your next meal - right next to you](https://github.com/user-attachments/assets/c7586fbf-a161-4a9f-9531-644dda973a43)

WhereNext is a React Native mobile app designed to make trip planning and navigation seamless. With an interactive map at its core, users can search for locations, save favorite spots (marked with red pins), create plans to share with friends, tracking, and discover nearby restaurants. Each place features rich info like images, ratings, and descriptions — all in one smooth interface.

## Setup Instructions
1. Ensure the following environment setup exists in your machine:
   - Node.js 
2. Clone the repository and run:
   ```bash
     git clone <repository-url>
     cd WhereNext---SC2006-Project
   ```
3. Navigate to frontend to run:
   ```bash
     cd frontend
     npm install
   ```
4. Set up environment variables:
  - Create a .env file in backend and add in the following:
    ```bash
      PORT=4000
      MONGO_URI=<your-mongodb-uri>
      SECRET=<your-secret-key>
      GOOGLE_PLACES_API_KEY=<your-google-places-api-key>
      EVENTBRITE_API_KEY=<your-eventbrite-api-key>
    ```
  - Create a .env file in frontend and add in the following - while replacing the localhost with your ip address
    ```bash
    API_BASE_URL=http://localhost:4000
    ```
 - Update the config file to your ip adress by replacing localhost:
   ```bash
   const config = {
    API_URL: 'http://localhost:4000',
    };
    export default config;
   ```
5. Run the app by:
- Navigate to backend and run:
  ```bash
  node server.js
  ```
- Navigate to frontend and run:
  ```bash
  npx expo start
  ```
- Download Expo Go on your phone and scan the QR code

## 
