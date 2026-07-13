import { useState, useEffect } from "react"
import todoService from './services/todos'
import axios from 'axios'

const App = () => {

  const [todos, setTodos] = useState([])
  const [text, setText] = useState('New ToDo')
  const [appHealthy, setAppHealthy] = useState(null)

  useEffect(() => {
  const checkHealth = async () => {
    try {
      await axios.get('/healthz')
      setAppHealthy(true)
    } catch (error) {
      console.error('Something went wrong checking health', error)
      setAppHealthy(false)
    }
  }
    checkHealth()
    const interval = setInterval(checkHealth, 5000)

    return () => clearInterval(interval)
  }, [])


  useEffect(() => {
    todoService.getAll()
      .then(todos => {
        setAppHealthy(true)
        setTodos(todos)})
      .catch(error => {
        console.error('Backend not reachable', error)
        setAppHealthy(false)
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const todoObject = {
      text: text
    }
    const savedTodo = await todoService.create(todoObject)
    setTodos(todos.concat(savedTodo))
    setText('New ToDo')
  }

  const breakApp = async () => {
    try {
      await axios.post('/break')
      setAppHealthy(false)
    } catch (error) {
      console.error('Failed to break app', error)
    }
  }

  if (appHealthy === null) {
    return <div>Loading...</div>
  }

  if (!appHealthy) {
    return <div>
      <h2 color="red">System failure</h2>
      <p color="red">The Todo App is currently unhealthy. Please wait for recovery</p>
    </div>
  }
  const markAsDone = (id) => {
    const todoToMark = todos.find(t => t.id === id)
    const markedTodo = {...todoToMark, done: !todoToMark.done}

    todoService
      .markDone(id, markedTodo)
      .then(res => {
        setTodos(todos.map(t => t.id !== id ? t : res.data))
      })
      .catch((err) => {      
        console.log('Something went wrong: ', err.message) 
      })    
  }
  return (
    <div>
      <h1>ToDo App</h1>
            <form onSubmit={handleSubmit}>
                <label>
                  Text:
                </label>  
                <input 
                  type="text"
                  id="text"
                  onChange={({ target }) => setText(target.value)}
                />  
                <button type="submit">Send</button>
            </form>
            {todos.length === 0 ?
              <p>No Todos!</p>
            :
              <ul>
               {todos.map(t => 
                <li id={t.id}>
                {t.done === false ?            
                    <p>
                      {t.text}
                      <button onClick={() => markAsDone(t.id)}>MARK DONE</button>
                    </p> 
                :               
                    <p><del>{t.text}</del> - <b>DONE</b></p>     
                }
                </li>
               )}
              </ul>
            }
            <button onClick={breakApp}>Break</button>
    </div>
        
  )
}

export default App
