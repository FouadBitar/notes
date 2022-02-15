import './TaskPage.css';
import React, { useState } from 'react';


//Split up into two different windows with a side menu
// when we flip between windows, it loses the state, would making it an object make a difference?


const Button = (props) => {
  return (
    <div className="Button-Container">
      <button onClick={props.onClick} className={props.className}>{props.text}</button>
    </div>
  );
}

function Task(props){

  function handleChange(e) {
    props.onChange(props.id, e.target.value);
  }

  let onChangeFunc;
  if(props.completed) {
    onChangeFunc = () => {};
  } else {
    onChangeFunc = handleChange;
  }

  return(
    <div className="Task-Container">
      <form>
        <label>
          <input value={props.taskText} onChange={onChangeFunc} type="text" className="Task-Input"/>
        </label>
      </form>
    </div>
  );
}

function TaskPage() {

  const firstTask = {id: 1, taskText: '', completed: false};
  const [tasks, setTasks] = useState([firstTask]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [count, setCount] = useState(1);

  function handleChange(id, newValue) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        const updatedTask = {
          ...task,
          taskText: newValue,
        };

        return updatedTask;
      }

      return task;
    });

    setTasks(newTasks);
  }


  function returnToActiveTasks(task) {
    const newCompletedTasks = completedTasks.filter((item) => item.id !== task.id);
    let newTasks = tasks;
    let newTask = {...task, completed: false};
    newTasks.push(newTask);

    setTasks(newTasks);
    setCompletedTasks(newCompletedTasks); 
  }


  function incrementCount(){
    setCount(count + 1);
  }

  function addTask(){
    let id = count + 1;

    const newTask = {id: id, taskText: '', completed: false};
    setTasks([...tasks, newTask]);
    incrementCount();
  }

  function removeTask({ id }){
    const newTasks = tasks.filter((task) => task.id !== id);

    setTasks(newTasks); 
  }

  function markAsDone(task){
    let completedTask = tasks.find((item) => item.id === task.id);
    completedTask = {
      ...completedTask,
      completed: true
    };

    removeTask(completedTask);

    let newCompletedTasks = completedTasks;
    newCompletedTasks.push(completedTask);
    setCompletedTasks(newCompletedTasks);
  }

  return (
    <div className="App">

      <Button onClick={addTask} text="Add" className="Add-Task-Button" />

      <h3>Tasks</h3>
      {tasks.map( (item, i) => {
        return(
          <div>
            <Task id={item.id} taskText={item.taskText} onChange={handleChange} />
            <button onClick={() => removeTask(item)} className="Delete-Button">delete</button>
            <button onClick={() => markAsDone(item)}>done</button>
          </div>
        )
      })}

      <h3>Completed</h3>
      {completedTasks.map( (item, i) => {
        return(
          <div>
            <Task id={item.id} taskText={item.taskText} completed={item.completed} />
            <button onClick={() => returnToActiveTasks(item)}>return</button>
          </div>
        )
      })}
    </div>
  );
}

export default TaskPage;
