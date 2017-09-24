# Square Checker

Square checker is a tool that can find all possible squares from the given (x, y) points.

![alt text](/demo.gif)

# Architecture

Projects consists of two folers - square-checker-backend (server), square-checker-frontend (react).

Square-checker-backend - contains server code, which opens a socket for frontend connections.

Square-checker-frontend - contains frontend code which sends requests through a socket to backend.

# How to make it run

In order to run the application, you have to the the following

1. Execute `npm install` and `npm start` in the square-checker-backend folder
2. Execute `npm install` and `npm start` in the square-checker-frontend folder

# How to use it

1. You can enter a point by entering x and y values in the "Add new points" tab. After that press add and you will see your point being added to the list.
2. You can save these points by entering file name and clicking save in "Files" tab
3. You can add some points to your list from files by clicking Load points next to the file listed in "Files" tab
4. When the points are ready you can click Find Squares button in the "Square processing tab"
