const { Pool } = require("pg"); 
const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });

const create_students_table_query = fs.readFileSync("./query/create_students_table.sql").toString();
const insert_students_table_query = fs.readFileSync("./query/insert_inital_data.sql").toString();
const get_all_students_query = fs.readFileSync("./query/get_all_students.sql").toString();

let pool;

const connectDB = async () => {
    try{
        pool = new Pool({
            user: 'tung',
            host: 'localhost',
            password: 'postgres',
            port: '5432',
        });
        console.log("Successfully connected to postgres database server.");
        console.log("");
    }
    catch(err){
        console.log(err.message)
    }
}

const createNewDatabase = async () => {
    
    try{
        await  pool.query("DROP DATABASE IF EXISTS assignment4_university")
        await  pool.query("CREATE DATABASE assignment4_university;")
        pool.end();
        pool = new Pool({
            user: 'tung',
            host: 'localhost',
            database: 'assignment4_university',
            password: 'postgres',
            port: '5432',
        });

        // console.log(res)
        console.log("Created a new database assignment4_university and successfully connected.");
    }
    catch(err){
        console.log(err.message);
        console.log("error connecting to database");
    }
    
}

const main = async () => {
    try{
        await connectDB();
        await createNewDatabase();

        getUserInputWithPrompt("Press 1 create student table: ");
        console.log('');
        await createStudentTable();
        console.log("--------------------------------------------------\n");

        getUserInputWithPrompt("Press 1 insert initial sample data: ");
        console.log('');
        await insertInitalData();
        console.log("Student table after inserting initial data");
        await getAllStudents();
        console.log("--------------------------------------------------\n");


        getUserInputWithPrompt("Press 1 test adding a student: ");
        console.log('');
        await addStudent("Tung", "Tran", "tungtran@test.com", '2024-09-01');
        console.log("Student table after adding:");
        await getAllStudents();
        console.log("--------------------------------------------------\n");

        getUserInputWithPrompt("Press 1 test adding a student with duplicate email: ");
        console.log('');
        await addStudent("Mem", "Ber", "tungtran@test.com", '2024-09-01');
        console.log("Student table after adding duplicate:");
        await getAllStudents();
        console.log("--------------------------------------------------\n");

        getUserInputWithPrompt("Press 1 test updating a student: ");
        console.log('');
        await updateStudentEmail(4, "tungtran@com.gmail");
        console.log("Student table after updating:");
        await getAllStudents();
        console.log("--------------------------------------------------\n");

        getUserInputWithPrompt("Press 1 test updating a student with duplicate email (error handling case): ");
        console.log('');
        await updateStudentEmail(4, "jane.smith@example.com");
        console.log("Student table after updating:");
        await getAllStudents();
        console.log("--------------------------------------------------\n");

        getUserInputWithPrompt("Press 1 test deleting a student with id of 4:");
        console.log('');
        await deleteStudent(4); //DELETE function call
        console.log("Student table after updating:");
        await getAllStudents();
        console.log("--------------------------------------------------\n");

        getUserInputWithPrompt("Press 1 test deleting a student with id of 1000 (Error case):");
        console.log('');
        await deleteStudent(1000); //DELETE function call
        console.log("Student table after updating:");
        await getAllStudents();
        console.log("--------------------------------------------------\n");

        console.log("All tests are done. Exiting the program.");
        pool.end();
    }
    catch(err){
        console.log("error occured");
        console.log(err);
    }
}

const createStudentTable = async () => {
    try {
        await pool.query(create_students_table_query);
        console.log("Succesfully created students table");
    } catch (err) {
        console.error(err);
    }
}

const insertInitalData = async () => {
    try {
        await pool.query(insert_students_table_query);
        console.log("Succesfully inserted data into student table");
    } catch (err) {
        console.error(err);
    }

}

const getAllStudents = async () => {
    try {
        let res = await pool.query(get_all_students_query);
        console.log(res.rows);
    } catch (err) {
        console.error(err);
    }
}

const addStudent = async (first_name, last_name, email, enrollment_date) => {
    try {
        console.log(`Adding a new student: firstname = ${first_name}, lastname = ${last_name}, email = ${email}, enrollment_date = ${enrollment_date}`);
        let query = `INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES ('${first_name}', '${last_name}', '${email}', '${enrollment_date}')`;
        await pool.query(query);
        console.log("Successfully added student to the database");
    } catch (err) {
        if(err.code == 23505){
            console.log("Error adding new student. Email already exists in the database!");
        }
        else {
            console.error(err);
        }
    }
}


const updateStudentEmail = async (student_id, new_email) => {   
    try {
        console.log(`Updating email of student with id = ${student_id} to ${new_email}`);
        let query = `UPDATE students SET email = '${new_email}' WHERE student_id = ${student_id}`;
        await pool.query(query);
        console.log("Successfully updated student email");
    } catch (err) {
        if(err.code == 23505){
            console.log("Error updating student email. Email already exists in the database!");
        }else {
            console.error(err);
        }
    }
}


const deleteStudent = async (student_id) => {
    try {
        console.log(`Deleting student with id = ${student_id}`);
        let query = `DELETE FROM students WHERE student_id = ${student_id}`;
        const res = await pool.query(query);
        if(res.rowCount > 0){
            console.log("Successfully deleted student.");
        }
        else{
            console.log("None were deleted.");
        }
    } catch (err) {
        console.error(err);
    }
}

const getUserInputWithPrompt = async (prompt_message) => {
    let input = prompt(prompt_message);
        while(input != 1){
            input = prompt(prompt_message);
        }
}



main();
