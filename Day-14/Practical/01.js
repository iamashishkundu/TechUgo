import mysql from "mysql2/promise";

const pool = await mysql.createPool({
    host: "localhost",
    user: "username",
    password: "password",
    database: "myapp",
    connectionLimit: 10,
});

async function insert(){
     await pool.query(`
        INSERT INTO users (id,name,email)
        VALUES
            ('1','Ashish','ashish@gmail.com'),
            ('2','Aryan','aryan@gmail.com'),
            ('3','Aditya','aditya@gmail.com')
        `);
    console.log(`Data inserted Successfully.`);
}

async function print(){
     const [rows] = await pool.query(`
        SELECT * FROM users
        `);

    console.log(`Users:`);
    console.log(rows);
}

async function remove(){
    await pool.query(`
        DELETE FROM users WHERE id = 2
        `);
    console.log(`Data Deleted Successfully.`)
}

async function modify(){
    await pool.query(`
        UPDATE users
        SET name = 'Adi'
        WHERE id = 3
        `)
    console.log(`Data Modified successfully.`)
}
try{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL
        ) 
        `);
        console.log(`Table created succesfully.`)
        await insert();
        await print();
        await modify();
        await print();
        await remove();
        await print();


}catch(err){
    console.log("Error:",err);
}finally{
    await pool.end();
    console.log(`Pool Closed`);
}
