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


// everytime we change the state of the parent App state, it will re-render since this info is passed down to the child


class TaskPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = props.taskState;

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

        //update parent state
        const newState = { ...this.state, tasks: newTasks };
        this.props.onStateChange(newState);

        this.setState({ tasks: newTasks });
    }


    returnToActiveTasks(task) {
        const newCompletedTasks = this.state.completedTasks.filter((item) => item.id !== task.id);
        let newTasks = this.state.tasks;
        let newTask = {...task, completed: false};
        newTasks.push(newTask);


        //update parent state
        const newState = { ...this.state, tasks: newTasks, completedTasks: newCompletedTasks };
        this.props.onStateChange(newState);


        this.setState({ tasks: newTasks, completedTasks: newCompletedTasks });
    }


    incrementCount(){
        let currentCount = this.state.count;

        //update parent state
        const newState = { ...this.state, count: currentCount + 1 };
        this.props.onStateChange(newState);

        this.setState({ count: currentCount + 1});
    }

    addTask(){
        let id = this.state.count + 1;
        const newTask = {id: id, taskText: '', completed: false};

        let tasks = this.state.tasks;

        //update parent state
        const newState = { ...this.state, tasks: [...tasks, newTask] };
        this.props.onStateChange(newState);

        this.setState({ tasks: [...tasks, newTask]});

        this.incrementCount();
    }

    removeTask({ id }){
        const newTasks = this.state.tasks.filter((task) => task.id !== id);
        console.log("new tasks:");
        console.log(newTasks);

        //update parent state
        const newState = { ...this.state, tasks: newTasks };
        this.props.onStateChange(newState);        

        this.setState({ tasks: newTasks });
    }

    markAsDone(task){
        let completedTask = this.state.tasks.find((item) => item.id === task.id);
        completedTask = {
            ...completedTask,
            completed: true
        };

        const newTasks = this.state.tasks.filter((task) => task.id !== completedTask.id);     

        this.setState({ tasks: newTasks });


        let newCompletedTasks = this.state.completedTasks;
        newCompletedTasks.push(completedTask);
        console.log("new completed tasks");
        console.log(newCompletedTasks);

        //update parent state
        const newState = { ...this.state, completedTasks: newCompletedTasks, tasks: newTasks };
        this.props.onStateChange(newState);

        this.setState({ completedTasks: newCompletedTasks });
    }

    markAsDone2(task){
        let state = this.props.taskState;
        let completedTask = state.tasks.find((item) => item.id === task.id);
        completedTask = {
            ...completedTask,
            completed: true
        };

        const newTasks = state.tasks.filter((task) => task.id !== completedTask.id);     

        let newCompletedTasks = state.completedTasks;
        newCompletedTasks.push(completedTask);

        const newState = { ...state, completedTasks: newCompletedTasks, tasks: newTasks };
        this.props.onStateChange(newState);

    }

    render() {
        console.log("task page is re-rendered");
        console.log(this.props.taskState);
        return(
            <div className="App">

                <Button onClick={this.addTask} text="Add" className="Add-Task-Button" />

                <h3>Tasks</h3>
                {this.props.taskState.tasks.map( (item, i) => {
                    return(
                    <div>
                        <Task id={item.id} taskText={item.taskText} onChange={this.handleChange} />
                        <button onClick={() => this.removeTask(item)} className="Delete-Button">delete</button>
                        <button onClick={() => this.markAsDone2(item)}>done</button>
                    </div>
                    )
                })}

                <h3>Completed</h3>
                {this.props.taskState.completedTasks.map( (item, i) => {
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
