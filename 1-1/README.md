# Phillipines Unofficial Real-Time Tally of Votes

Developed By: Alfie V. Osayan

Description:
A web app of Phillipines Unofficial Real-Time Tally
with Phillipines Geographical Data Representations.

Features:
- Philippine Geographical Map using D3js
- User(Watchers/Volunteers) Login & Registration
- Create, Read, Update and Delete of Election Candidates
- Realtime passing of unofficial tally data from the users.

Technologies Used
- D3js
- Socket.io
- MongoDB Atlas
- NodeJs
- Express
- HTML
- Bootstrap
- CSS
- Javascript

How to Run the App.
Clone the source code:
```
git clone https://github.com/phengzkie/phillipines-election-realtime-tally.git

```
On command line, type
```
npm install
nodemon apps.js
```

** Instructions **
[Login](http://localhost:8000/login) as an admin using these credentials.
email: admin@test.com
password: 12345678

Add,Update and Delete some candidates in [Candidates](http://localhost:8000/dashboard/candidates).

[Register](http://localhost:8000/register) as a user.

Update votes every candidates.
