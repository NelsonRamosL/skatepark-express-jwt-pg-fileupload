///   ejemplo coneccion cambiar datos
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "1234",
    database: "skatepark",
    port: 5432
});


// agregar nuevo skater
const nuevoSkater = async (usuario) => {
    const values = Object.values(usuario);
    console.log(values);
    const consulta = {
        text: "INSERT INTO skaters ( email, nombre, password ,anos_experiencia, especialidad , foto , estado) values ($1,$2,$3,$4,$5,$6,false) RETURNING *",
        values
    };
    const result = await pool.query(consulta);
    return result;
}






// logear skater en la base de datos
const getAuthSkater = async (skater) => {
    const values = Object.values(skater);
    console.log(values);
       const consulta = {
           text: "SELECT * FROM skaters WHERE email = $1 AND password = $2",
           values
       };
       const result = await pool.query(consulta);
    console.log(result)
    return result.rows[0];
}


const getSkaters = async () => {
    const result = await pool.query("SELECT * FROM skaters");
    console.log(result)
    return result.rows;
}


const skaterAuth = async (usuario) => {
    const values = Object.values(usuario);
 console.log(values);
    const consulta = {
        text: "UPDATE skaters SET estado=$2 WHERE id=$1 RETURNING *",
        values
    };
    const result = await pool.query(consulta);
    return result;
}




const getSkatersId = async (id) => {
    const result = await pool.query(`SELECT * FROM skaters WHERE id=${id}`);
    console.log(result.rows)
    return result.rows;
}


const eliminarSkater = async (id) => {
    console.log("en bd",id);
    const result = await pool.query(`DELETE FROM skaters WHERE id = ${id}`);
    return result;
}



const editarSkater = async (skater) => {
    const values = Object.values(skater);
 console.log(values);
    const consulta = {
        text: "UPDATE skaters SET email=$1, nombre=$2, password=$3, anos_experiencia=$4, especialidad=$5 WHERE id=$6 RETURNING *",
        values
    };
    const result = await pool.query(consulta);
    return result;
}




module.exports = { nuevoSkater,getAuthSkater,getSkaters,skaterAuth,getSkatersId,eliminarSkater,editarSkater }