import React, { PureComponent } from 'react';

import Search from './components/Search';
import List from './components/List';
import AddListItem from './components/List/AddListItem';
import Modal from './components/Modal';

export default class App extends PureComponent {
  state = {
    searchText: '',
    todoItems: [],
    activeItem: null,
    isModalOpen: false,
  };

  handleSearch = (searchText) => {
    this.setState({ searchText });
  }

  handleItemChange = (id) => {
    const { todoItems } = this.state;
    const itemIndex = todoItems.findIndex(item => item.id === id);
    const { done, ...restData } = todoItems[itemIndex];

    this.setState({
      todoItems: [
        ...todoItems.slice(0, itemIndex),
        { done: !done, ...restData },
        ...todoItems.slice(itemIndex + 1)
      ],
    });
  }

  handleAddItem = (item) => {
    this.setState({
      searchText: '',
      todoItems: [
        ...this.state.todoItems,
        item,
      ],
    });
  }

  handleConfirmDelete = (item) => {
    this.setState({
      activeItem: item,
      isModalOpen: true,
    });
  }

  handleItemDelete = (id) => {
    const { todoItems } = this.state;
    const nextTodoItems = todoItems.filter(item => item.id !== id);
    this.setState({
      activeItem: null,
      isModalOpen: false,
      todoItems: nextTodoItems,
    });
  }

  handleModalClose = () => {
    this.setState({
      activeItem: null,
      isModalOpen: false,
    });
  }

  handleFilterItems = (query, items) => {
    if (!query.length) return items;
    return items.filter(({ name }) => (
      name.toLowerCase().includes(query.toLowerCase())
    ));
  }

  render() {
    const {
      todoItems,
      activeItem,
      searchText,
      isModalOpen
    } = this.state;
    const filteredItems = this.handleFilterItems(searchText, todoItems);

    return (
      <>
        {isModalOpen && (
          <Modal
            item={activeItem}
            onConfirm={this.handleItemDelete}
            onClose={this.handleModalClose}
          />
        )}
        <div className={isModalOpen ? 'modal-bg' : ''} />
        <section className="section">
          <h1 className="title">ToDo app</h1>
          <Search
            onSearch={this.handleSearch}
            searchValue={searchText}
          />
          <List
            todos={filteredItems}
            onDelete={this.handleConfirmDelete}
            onChange={this.handleItemChange}
          />
          <AddListItem
            onAddItem={this.handleAddItem}
          />
        </section>
      </>
    );
  }
}