import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import List from '../List/List';

import './TodoList.css';

export const ListContext = React.createContext({});

const TodoList = props => {
    return (
        <ListContext.Provider value={{ list: props.id }}>
            <article className="todolist">
                <Header
                    items={props.listObj.items.length}
                    title={props.listObj.name}
                    limit={props.listObj.limit}
                >
                </Header>
                <section>
                    <List
                        items={props.listObj.items} />
                </section>
            </article>
        </ListContext.Provider>
    )
}

TodoList.propTypes = {
    listObj: PropTypes.shape({
        items: PropTypes.array.isRequired,
        name: PropTypes.string,
        limit: PropTypes.number,
    }),
    id: PropTypes.string,
};
TodoList.defaultProps = {};

export default TodoList;