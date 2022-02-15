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

class TaskPage extends React.Component {

    constructor(props) {
        super(props);
        console.log("in constructor");
        console.log(this);
        this.state = {
            tasks: [{id: 1, taskText: '', completed: false}],
            completedTasks: [],
            count: 1
        }
        this.handleChange = this.handleChange.bind(this);
        this.returnToActiveTasks = this.returnToActiveTasks.bind(this);
        this.incrementCount = this.incrementCount.bind(this);
        this.addTask = this.addTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.markAsDone = this.markAsDone.bind(this);
    }



    handleChange(id, newValue) {
        const newTasks = this.state.tasks.map((task) => {
            if (task.id === id) {
                const updatedTask = {
                    ...task,
                    taskText: newValue,
                };

                return updatedTask;
            }

            return task;
        });

        this.setState({ tasks: newTasks });
    }


    returnToActiveTasks(task) {
        const newCompletedTasks = this.state.completedTasks.filter((item) => item.id !== task.id);
        let newTasks = this.state.tasks;
        let newTask = {...task, completed: false};
        newTasks.push(newTask);


        this.setState({ tasks: newTasks });
        this.setState({ completedTasks: newCompletedTasks }); 
    }


    incrementCount(){
        let currentCount = this.state.count;
        this.setState({ count: currentCount + 1});
    }

    addTask(){
        console.log("this in add task: ");
        console.log(this);
        let id = this.state.count + 1;
        const newTask = {id: id, taskText: '', completed: false};

        let tasks = this.state.tasks;
        this.setState({ tasks: [...tasks, newTask]});

        this.incrementCount();
    }

    removeTask({ id }){
        const newTasks = this.state.tasks.filter((task) => task.id !== id);

        this.setState({ tasks: newTasks });
    }

    markAsDone(task){
        let completedTask = this.state.tasks.find((item) => item.id === task.id);
        completedTask = {
            ...completedTask,
            completed: true
        };

        this.removeTask(completedTask);

        let newCompletedTasks = this.state.completedTasks;
        newCompletedTasks.push(completedTask);
        this.setState({ completedTasks: newCompletedTasks });
    }

    render() {

        return(
            <div className="App">

                <Button onClick={this.addTask} text="Add" className="Add-Task-Button" />

                <h3>Tasks</h3>
                {this.state.tasks.map( (item, i) => {
                    return(
                    <div>
                        <Task id={item.id} taskText={item.taskText} onChange={this.handleChange} />
                        <button onClick={() => this.removeTask(item)} className="Delete-Button">delete</button>
                        <button onClick={() => this.markAsDone(item)}>done</button>
                    </div>
                    )
                })}

                <h3>Completed</h3>
                {this.state.completedTasks.map( (item, i) => {
                    return(
                    <div>
                        <Task id={item.id} taskText={item.taskText} completed={item.completed} />
                        <button onClick={() => this.returnToActiveTasks(item)}>return</button>
                    </div>
                    )
                })}
            </div>
        );
    }


}

export default TaskPage;
