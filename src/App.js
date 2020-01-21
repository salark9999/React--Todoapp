import React, { Component } from 'react';
import TodoList from './components/TodoList/TodoList';
import AppHeader from './components/AppHeader/AppHeader';
import Contact from './pages/Contact/Contact';
import axios from 'axios';
import { debounce } from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';

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
    this.saveDebounced = debounce(this.save, 1000);
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

      this.setState({
        ...state,
        loading: false
      })
    })
      .catch(() => {
        this.setState({
          ...defaultState,
          loading: false
        })
      })
  };

  save = (list, stateList) => {
    this.setState({
      loading: true,
    });
    // localStorage.setItem('todos', JSON.stringify(this.state));
    axios.patch(`${URL}/lists/${list}`, stateList).finally(() => {
      this.setState({ loading: false });
    });
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

          this.setState({
            [list]: stateList,
          },
            () => {
              this.saveDebounced(list, stateList);
            });
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
          this.setState({
            [list]: stateList,
          },
            () => {
              this.saveDebounced(list, stateList);
            });
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
          <Router >
            <AppHeader />
            <Route path="/" exact component={() => (
              <div className="App"
                style={{
                opacity: this.state.loading ? 0.2 : 1,
                pointerEvents: this.state.loading ? "none" : "all"
              }}
              >
                <TodoList
                  id={'core'}
                  listObj={this.state.core}
                />
                <TodoList
                  id={'fta'}
                  listObj={this.state.fta}
                />
              </div>
            )}>  
            </Route>
            <Route path="/about" exact component={() => (
              <article className="App">
                <h2>About this app</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nulla dignissim lectus diam, sit amet suscipit elit lacinia vitae.
                  Sed rhoncus mattis ipsum at rhoncus.
                  Donec condimentum, ipsum ac sollicitudin hendrerit,
                  felis elit ultricies sapien, molestie placerat ligula metus ut tortor.
                </p>
              </article>
            )}> 
            </Route>
            <Route  path="/contact" exact component={Contact} />
          </Router>
          </AppContext.Provider>
    );
  }
}

export default App;
