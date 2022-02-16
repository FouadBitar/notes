import './App.css';
import TaskPage from './TaskPage';
import CompletedPage from './CompletedPage'
import React from 'react';


// going to lift the state up to the top parent of App, then will pass down to child necessary state

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isTaskPage: true,
      taskState: {
        tasks: [{id: 1, taskText: '', completed: false}],
        completedTasks: [],
        count: 1
      }
    };
    
    this.returnPage = this.returnPage.bind(this);
    this.setIsTaskPage = this.setIsTaskPage.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
  }

  onStateChange(newState) {
    this.setState({ ...this.state, taskState: newState });
  }

  returnPage() {
    if(this.state.isTaskPage){
      return <TaskPage taskState={this.state.taskState} onStateChange={this.onStateChange}></TaskPage>
    } else {
      console.log(this.state.taskState);
      return <CompletedPage></CompletedPage>
    }
  }

  setIsTaskPage(value) {
    this.setState({ isTaskPage: value });
  }

  render() {
    return (
      <div className="App">

        
        {console.log("app is re-rendered")}
        <div>
          <button onClick={() => this.setIsTaskPage(true)}>Tasks</button>
          <button onClick={() => this.setIsTaskPage(false)}>Completed</button>
        </div>
  
        {this.returnPage()}
      </div>
    );
  }
  
}

export default App;
