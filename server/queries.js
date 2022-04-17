const Pool = require('pg').Pool
const pool = new Pool({
  user: 'fouadbitar',
  host: 'localhost',
  database: 'notes_database',
  password: 'ghost',
  port: 5432,
})


const getNotes = (request, response) => {
    pool.query('SELECT * FROM notes', (error, results) => {
      if (error) {
        throw error
      } 
      response.status(200).json(results.rows)
    })
  }

const addNote = async (request, response) => {
  console.log('entered in addnote');
  const note = request.body;
  try {
    await pool.query("INSERT INTO notes(text, archived, last_updated) VALUES ($1, $2, current_timestamp);",
      [note.text, note.archived])
    const getallnotes = await pool.query('SELECT * FROM notes');
    response.status(200).json(getallnotes.rows)

  } catch (error) {
    console.log(error);
  }

}

const updateNote = async (request, response) => {
    console.log('entered in updatenote');
    const note = request.body;
    
    try {
      await pool.query("UPDATE notes SET text=$1, archived=$2, last_updated=current_timestamp WHERE id=$3", 
        [note.text, note.archived, note.id])
      const getallnotes = await pool.query('SELECT * FROM notes');
      response.status(200).json(getallnotes.rows)

    } catch (error) {
      console.log(error);
    }
}

const deleteNote = async (request, response) => {
  const id = request.params.id;
  try {
    const deletenote = await pool.query("DELETE FROM notes WHERE id=$1", [id]);
    console.log(deletenote.rows);
    const getallnotes = await pool.query('SELECT * FROM notes');
    console.log(getallnotes.rows);

    response.status(200).json(getallnotes.rows)
  } catch (error) {
    console.log(error);
  }
  
}

module.exports = {getNotes, addNote, updateNote, deleteNote};