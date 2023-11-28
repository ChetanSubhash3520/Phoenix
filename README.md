# Phoenix

Instructions for Running the Code

Frontend Configuration

Navigate to the Frontend folder and execute the following commands:
1. npm i - Installs all the necessary Node.js modules.
2. npm start - Initiates the application, defaulting to port number 3000.


Backend Configuration

Move to the Backend folder
1. Download the 'scripts.sql' file and import the database into the MySQL database to initialize with the initial data.
2. To import MySQL data, log in to your MySQL, create a database named 'teamproject' using the command 'create database teamproject'.
3. Use the command mysql -u username -p your_database_name < dumpfilename.sql to import the data into the database.
4. Modify the username, password, and database name as per your system configuration in the 'main.go' file within the Backend folder.
5. To execute the backend, navigate to the backend folder and run the command go run .\main.go.
