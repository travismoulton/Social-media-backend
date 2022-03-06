# Threaded Chat Application

[Check out the site here](https://threddit.win)

### How to interact with the site

This is a simplified reddit clone with user registration and login functionality, and the ability for users to create their own groups. Users can also create threads, and can comment on threads, and the sub-comments within them. The comments are threaded, with the ability to hide all replies to a certain comment. Users can delete and edit their own comments. There is also a voting feature to up or down vote comments / threads. The thread feeds on the home page and group pages are sorted by popularity by default, but can also sorted by newest or oldest threads. On the thread feeds, there is scrolling pagination, so if there are any more threads, scrolling down will make an api call and load them.

### The tech I used.

This full stack application features Node and Express on the backend as a rest api, and with React on the frontend. The database is mongoDB, with mongoose as an ORM. The authenitcation is handled with JWT and cookies. The backend is hosted on heroku. The frontend is built with React with hooks. Global app state is managed by React-Redux using Redux toolkit. Styling is handled with CSS modules. React-router-dom is utilized for navigating the site. The frontend is tested with Jest and React-Testing-Library.

### Thanks for taking the time to check out my project!
