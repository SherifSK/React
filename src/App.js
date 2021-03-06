import React, {Component} from 'react';
import Web3 from 'web3';
import './App.css';
import {TODO_LIST_ABI, TODO_LIST_ADDRESS} from './config.js';
import TodoList from './TodoList.js'

class App extends Component {

  componentWillMount(){
    this.loadBlockchainData();
  }
  
  async loadBlockchainData() {
    //const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")

    const web3 = new Web3(Web3.givenProvider)
    
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    this.setState({ account: account })
    
    const todolist = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS)
    this.setState({ todolist })
    const taskCount = await todolist.methods.taskCount().call()
    this.setState({ taskCount })
    for(var i = 1; i <= taskCount; i++) {
      const task = await todolist.methods.tasks(i).call()
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    }
    this.setState({ loading: false })
  }

  async updateTasksList() {
    this.setState({ tasks: []})
    
    const taskCount = await this.state.todolist.methods.taskCount().call()
    this.setState({ taskCount })

    for(var i = 1; i <= this.state.taskCount; i++) {
      const task = await this.state.todolist.methods.tasks(i).call()
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    }
  }

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      taskCount: 0,
      tasks: [],
      loading: true
    }

    this.createTask = this.createTask.bind(this)
    this.toggleCompleted = this.toggleCompleted.bind(this)
  }

  createTask(content) {
    this.setState({ loading: true })
    this.state.todolist.methods.createTask(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.updateTasksList()
      this.setState({ loading: false })
    })
  }

  toggleCompleted(taskId) {
    this.setState({ loading: true })
    this.state.todolist.methods.toggleCompleted(taskId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.updateTasksList()
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.dappuniversity.com/free-download" target="_blank">Dapp University | Todo List</a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small><a className="nav-link" href="#"><span id="account"></span></a></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">              
              { this.state.loading 
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <TodoList tasks={this.state.tasks} createTask={this.createTask} toggleCompleted={this.toggleCompleted} /> 
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
