import './App.css';
import TaskPage from './TaskPage';
import CompletedPage from './CompletedPage'
import React, { useState } from 'react';


// should either store the taskpage object as state in this App function or make App a class as well


function App() {

  const [isTaskPage, setIsTaskPage] = useState(true);


  function returnPage() {
    if(isTaskPage){
      return <TaskPage></TaskPage>
    } else {
      return <CompletedPage></CompletedPage>
    }
  }

  return (
    <div className="App">

      <div>
        <button onClick={() => setIsTaskPage(true)}>Tasks</button>
        <button onClick={() => setIsTaskPage(false)}>Completed</button>
      </div>

      {returnPage()}
    </div>
  );
}

export default App;
