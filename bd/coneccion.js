///   ejemplo coneccion cambiar datos
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "1234",
    database: "skatepark",
    port: 5432
});



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

module.exports = { nuevoSkater }