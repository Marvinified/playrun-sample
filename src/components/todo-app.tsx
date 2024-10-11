'use client'

import { useState, KeyboardEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit2, Check } from 'lucide-react'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'pending' | 'completed'

export function TodoAppComponent() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (id: number, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    if (editingId !== null) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText } : todo
      ))
      setEditingId(null)
    }
  }

  const markAllDone = () => {
    setTodos(todos.map(todo => ({ ...todo, completed: true })))
  }

  const clearList = () => {
    setTodos([])
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true
    if (filter === 'completed') return todo.completed
    if (filter === 'pending') return !todo.completed
    return true
  })

  const pendingCount = todos.filter(todo => !todo.completed).length
  const completedCount = todos.filter(todo => todo.completed).length

  return (
    <div className="w-full max-w-[612px] mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex mb-4">
        <Input
          aria-label='new-todo'
          type="text"
          name="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new todo"
          className="flex-grow mr-2"
        />
        <Button id="add-new-todo" onClick={addTodo} className="bg-blue-500 hover:bg-blue-600 text-white">Add</Button>
      </div>
      {todos.length > 0 && (
        <div className="mb-4 flex justify-center">
          <div className="inline-flex space-x-3 rounded-full bg-gray-100 p-1">
            <Button
              aria-label='all'
              onClick={() => setFilter('all')}
              className={`bg-white hover:bg-white text-gray-800 px-4 py-2 rounded-full text-sm ${filter === 'all'
                ? 'border-[1px] border-zinc-600'
                : ''
                }`}
            >
              All ({todos.length})
            </Button>
            <Button
              aria-label='pending'
              onClick={() => setFilter('pending')}
              className={` bg-white hover:bg-white text-gray-800 px-4 py-2 rounded-full text-sm ${filter === 'pending'
                ? 'border-[1px] border-zinc-600'
                : ''
                }`}
            >
              Pending ({pendingCount})
            </Button>
            <Button
              aria-label='completed'
              onClick={() => setFilter('completed')}
              className={`bg-white hover:bg-white text-gray-800 px-4 py-2 rounded-full text-sm ${filter === 'completed'
                ? 'border-[1px] border-zinc-600'
                : ''
                }`}
            >
              Completed ({completedCount})
            </Button>
          </div>
        </div>
      )}
      <ul className="space-y-2">
        {filteredTodos.map(todo => (
          <li key={todo.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
            {editingId === todo.id ? (
              <>
                <Input
                  type="text"
                  name="edit-todo"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit()
                  }}
                  className="flex-grow"
                />
                <Button id="save-edit" onClick={saveEdit} size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  id={`todo-${todo.id}`}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}
                >
                  {todo.text}
                </label>
                <Button onClick={() => startEditing(todo.id, todo.text)} size="sm" variant="outline" className="hover:bg-gray-200" aria-label='edit' >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button onClick={() => deleteTodo(todo.id)} size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white" aria-label='delete'>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
      {todos.length > 0 ? (
        <div className="mt-4 flex justify-between items-center">
          <div className="space-x-2">
            <Button onClick={markAllDone} variant="outline" className="hover:bg-gray-100">Mark All Done</Button>
            <Button onClick={clearList} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">Clear List</Button>
          </div>
          <div className="text-gray-600">
            Total: {todos.length} {todos.length === 1 ? 'item' : 'items'}
          </div>
        </div> 
      )  : (
        <div className="mt-4 text-gray-600 text-center">No todos yet!</div>
      )}
    </div>
  )
}