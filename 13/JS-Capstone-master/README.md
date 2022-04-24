#Title: JS Capstone

#Developed By: Judy Mae Mariano

#Demo Link: https://www.youtube.com/watch?v=3B72oQAU-kU

#Description (list the features):
 - features:
   - user can login and logout
   - user can connect with users who are registered in the app
   - app will translate the user's language to the other user's language. This feature is helpful in a way that the users can speak using their own language and that the application will translate it to the language that the other user use.
   - User has the option to record their call and can view it in their dashboard.
   - In the video call page, the app also has a chatbox where they can communicate in case the other user's mic is not working.

#Technologies used:
 - speech recognition web api
 - webrtc
 - postgress
 - google-translate-api-github

#How to run app:
 - User first needs to register, after that they will have to login.
 - After loggin in, user can view their dashboard. In their dashboard, they can play recorded videos of their call.
 - In the friend's list of user's list page, are list of users who are also using the app. After clicking the connect button, it will send a request to the other user that they have to accept for them to be in the same room.
 - While in video room, they have the option to turn on their camera, record their session, and to mute or unmute theirselves.

#Instructions to use
 - nodemon app.js
