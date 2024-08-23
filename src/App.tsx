import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Button, TextField } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();


function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [todo1, setTodo1] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => {
        setTodos([...data.items])
        setTodo1([...data.items])
      },
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({id});
  }

  function updateTodo(id: string, todo: Schema["Todo"]["type"]) {
    client.models.Todo.update({id, content:todo.content, title:todo.title});
  }

  const todoChange = (id: string, content: string) => {
    todo1.filter(t => t.id === id)[0].content = content
    setTodo1(todo1)
  }

  const titleChange = (id: string, title: string) => {
    todo1.filter(t => t.id === id)[0].title = title
    setTodo1(todo1)
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}><TextField label="Default" defaultValue={todo.content || ""} onChange={(e) => todoChange(todo.id, e.target.value)}></TextField> 
          <TextField label="Default" defaultValue={todo.title || ""} onChange={(e) => titleChange(todo.id, e.target.value)}></TextField> 
          <Button onClick={() => deleteTodo(todo.id)}>Delete</Button>
          <Button onClick={() => updateTodo(todo.id, todo1.filter(t => t.id === todo.id)[0] || "")}>Update</Button></li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
