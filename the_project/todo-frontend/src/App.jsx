import { useState, useEffect } from "react"
import todoService from './services/todos'

const App = () => {

  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('new todo')

  useEffect(() => {
    todoService.getAll().then(todos => setTodos(todos))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    const todoObject = {
      title: title
    }

    const savedTodo = todoService.create(todoObject)
    setTodos(todos.concat(savedTodo))
  }

  return (
    <div>
      <h1>ToDo App</h1>
            <form onSubmit={handleSubmit}>
                <label>
                  title:
                </label>  
                <input 
                  type="text"
                  id="title"
                />  
                <button type="submit">Send</button>
            </form>
            {todos.length === 0 ?
              <p>No Todos!</p>
            :
              <ul>
               {todos.map(t => 
                <li id={t.id}>{t.title}</li>
               )}
              </ul>
            } 
    </div>
        
  )
}

export default App
