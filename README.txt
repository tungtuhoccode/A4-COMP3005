Name: Tung Tran
Student number: 101274157
Language: nodejs
Install instruction: 
    - To run the code, you have to have nodejs and npm installed. 
    - To install nodejs dependencies used in this program, use command "npm install" 

Running instruction: 
    - To run the program, go to the folder where the db_server.js file is located and use command: "node db_server.js"

Testing insturction: 
    - There are tests that were already written. You will just need to enter 1 when moving into the next test.

Function Explanation: 
    - getAllStudents(): 
        + query the database and return all entries in students table
    
    - addStudent(first_name, last_name, email, enrollment_date): 
        + add the student with the given params into the database
    
    - updateStudentEmail(student_id, new_email): 
        + update the student email with the given student_id
    
    - deleteStudent(student_id): 
        + delete the student with the given student id

    - insertInitalData(): 
        + Insert sample data into the database
    
    - createStudentTable(): 
        + Create a student table if not exists
    - connectDB(): 
        + Establish a connection to databse server
    - createNewDatabse: 
        + create a new databse named Assignment4_University
        + Establish a connection to the new databse

NOTE: 
Some simple query will be in query folder. However, query that use params of a function 