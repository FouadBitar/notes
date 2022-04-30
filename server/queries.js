const Pool = require('pg').Pool

const pool = new Pool();

pool
  .connect()
  .then(client => {
    console.log('connected TO IT MAN!')
    client.release()
  })
  .catch(err => console.error('error connecting', err.stack))
  .then(() => pool.end())



const getNotes = (request, response) => {
  pool.query('SELECT * FROM notes', (error1, results1) => {
    if (error1) {
      throw error1
    } 
    // get names of folders
    pool.query('SELECT * FROM folder_names', (error2, results2) => {
      if (error2) {
        throw error2
      } 

      response.status(200).json({notes: results1.rows, folder_names: results2.rows, test: "this is a test"})
    })
  })
}

const addNote = async (request, response) => {
  console.log(request.body);
  const note = request.body.note;
  const folder = request.body.folder;
  try {
    await pool.query("INSERT INTO notes(text, last_updated, folder) VALUES ($1, current_timestamp, $2);",
      [note.text, folder.name])
    const getallnotes = await pool.query('SELECT * FROM notes');
    response.status(200).json(getallnotes.rows)

  } catch (error) {
    console.log(error);
  }

}

const addFolderName = async (request, response) => {
  const folderName = request.body;
  console.log(folderName);
  try {
    await pool.query("INSERT INTO folder_names(name) VALUES ($1);", [folderName.name])
    const folderNames = await pool.query('SELECT * FROM folder_names');
    response.status(200).json(folderNames.rows)

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

module.exports = {getNotes, addNote, addFolderName, updateNote, deleteNote};