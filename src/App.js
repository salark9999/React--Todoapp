import React, { Component } from 'react';
import TodoList from './components/TodoList/TodoList';
import axios from 'axios';

import './App.css';

export const ACTION_EDIT = 'edit';
export const ACTION_DELETE = 'delete';
export const ACTION_ADD = 'add';

export const AppContext = React.createContext({});

const getId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const defaultState = {
  core: {
    name: 'Core',
    items: [],
    limit: 3
  },
  fta: {
    name: 'Feed the animals',
    items: [],
    limit: 7
  },
  loading: false
};

const URL = "http://localhost:4000";

class App extends Component {
  constructor(props) {
    super(props);

    const localStorageData = localStorage.getItem('todos');

    this.state = defaultState;
  }

  componentDidMount() {
    this.loadServerData();
  }


  loadServerData = () => {
    this.setState({ loading: true });
    axios.get(`${URL}/lists`).then(response => {
      const data = response.data;
      const state = defaultState;

      response.data.forEach(list => {
        if (state[list.id]) {
          state[list.id].items = list.items;
        }
      });

      this.setState({ ...state, loading: false });
    });
  };

  save = (list, stateList) => {
    this.setState({
        [list]: stateList,
        loading: true,
      }, () => {
        // localStorage.setItem('todos', JSON.stringify(this.state));
        axios.patch(`${URL}/lists/${list}`, stateList).then(() => {
          this.setState({ loading: false });
        });
      }
    );
  };


  handleChange = (operation, list, id, data = {}) => {

    const stateList = this.state[list];

    if (stateList) {

      if (operation === ACTION_ADD) {
        if (stateList.limit > stateList.items.length) {
          const newItem = {
            id: getId(),
            done: false,
            text: ''
          };

          stateList.items.push(newItem);

          this.save(list, stateList)
        }
      } else {
        const taskIndex = stateList.items.findIndex((task) => {
          if (task.id === id) {
            return true;
          }
        });

        if (taskIndex > -1) {
          switch (operation) {
            case ACTION_EDIT:
              stateList.items[taskIndex] = {
                ...stateList.items[taskIndex],
                ...data
              };
              break;
            case ACTION_DELETE:
              stateList.items.splice(taskIndex, 1);
          }

          this.save(list, stateList)
        }
      }
    } else {
      console.error('Nie znaleziono listy ', stateList)
    }
  };

  render() {
    return (
      <AppContext.Provider value={{
        handleChange: this.handleChange,
        hello: 'World'
      }}>
        <div className="App" style={{
          opacity: this.state.loading ? 0.2 : 1,
          pointerEvents: this.state.loading ? "none" : "all"
        }}>

          <h1>TODO APP {this.state.loading && <div>LOADING... PLEASE WAIT..</div>}</h1>
          <TodoList
            id={'core'}
            listObj={this.state.core}
          />
          <TodoList
            id={'fta'}
            listObj={this.state.fta}
          />
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;
