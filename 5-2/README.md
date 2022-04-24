# tech-track-expo
Tech Track app using react expo

This is the mobile app used for field operation personnels.
  -to download the app you need to install expo go (android)
  -for ios I can create a tunnel upon request since apple is not allowing published expo apps to be installed
  
  here is the link and QR if you want to download using expo go:
  https://expo.dev/@milagos09/techtrack
  
This app can be monitored using the web app which only an admin can access.

The registration on the web app is disabled for now
https://techtrack-admin.herokuapp.com/login

On the web app you can monitor every movement of your team on the field.
sensors being transmitted:
  -longitude
  -latitude
  -speed
  -heading
  -altitude
  -timestamp of data gathered
  
In essense if the app would be fully functional, providers such as telco, isp, or any service provider can utilize this app to promot work effeciency on their team on the field.

Features available as of this writing:
  -Login authentication both for web app and mobile app
  -Signup as a user for mobile app
  -Form validation
  -Live maps preview
  -Chat application for public and private chats for users and admin
  -Auto extraction of geolocation and other movement sensors from the mobile app
  -Detect online users
  -Full online deployment (with ios restriction)
  
Technologies used:
  1. Front End:
      -HTML, CSS, JavaScript, jQuery, Socket.io-client-side, React Native Expo, Bootstrap
  2. Back End:
      -Node.js, Express, Socket.io, MongoDB, Mongoose, EJS
  3. API's
      -Mapbox API for the web
  
  
 

