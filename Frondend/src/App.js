import React from 'react';
import './App.css';
import UserController from './controllers/UserController';
import TodoController from './controllers/TodoController';

function App() {
  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>Ứng dụng MVC - Quản lý Users & Todos</h1>
        </header>

        <main>
          <UserController />
          <TodoController />
        </main>
      </div>
    </div>
  );
}

export default App;

