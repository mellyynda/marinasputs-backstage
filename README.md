# React Firebase

This is an unstyled draft of a React Firebase project with Realtime Database authentication.

Project contains:
- Landing page (accessible without authentication)
- Login page with form
- Signup page with form
- Password Forget page with form
- Home page (only accessible after authentication)
- Account page with password reset form

## Start project
1. Create a file named config.js and add it to src/components/Firebase.
2. Create a Firebase project with Realtime Database [as described in the documentation](https://firebase.google.com/docs/database/web/start).
3. Initialise Realtime Database JavaScript SDK by adding the Firebase project settings to the config.js file, as described below: 
``` 
const config = {
  apiKey: "din API nyckel",
  authDomain: "projektID.firebaseapp.com",
  databaseURL: "https://DinDatabasNamn.europe-west1.firebasedatabase.app",
  projectId: "projekt ID",
  storageBucket: "bucket.appspot.com",
  appId: "app ID",
  measurementId: "measurementId"
};

export default config; 
```
4. Save and run `npm install` in the command prompt
5. Run `npm run start` to start the development server locally.