How to run this project: 

1. Clone this project

2. With ibm_db database, create a "users" table with 4 fields: id, fullname, email, password.
CREATE TABLE "<schema>".users ( id INT NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
                                fullname CHAR(45) ,
                                email CHAR(255) ,
                                password CHAR(255),
                                Primary key (id));


3. Run "npm install" to install all packages in package.json file.

4. Run "npm start " to start the project
