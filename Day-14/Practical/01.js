import mysql from "mysql2/promise";

const pool = await mysql.createPool({
    host: "localhost",
    user: "username",
    password: "password",
    database: "myapp",
    connectionLimit: 10,
});

try{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL
        ) 
        `);
        console.log(`Table created succesfully.`)

    await pool.query(`
        INSERT INTO users (name,email)
        VALUES
            ('Ashish','ashish@gmail.com'),
            ('Aryan','aryan@gmail.com'),
            ('Aditya','aditya@gmail.com')
        `);

    const [rows] = await pool.query(`
        SELECT * FROM users
        `);

    console.log(`Users:`);
    console.log(rows);

}catch(err){
    console.log("Error:",err);
}finally{
    await pool.end();
    console.log(`Pool Closed`);
}
