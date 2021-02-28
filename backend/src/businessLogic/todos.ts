import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { parseUserId } from '../auth/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { createLogger } from '../utils/logger'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'



const logger = createLogger('todos')

//input:query paramets for a dataLayer function, check if user is authorized  output: json format on ToDos for a specific user


const todoAccess = new TodoAccess()

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  

  logger.info('calling pareUserId', jwtToken)
  const userId = parseUserId(jwtToken)
  logger.info('calling getAllTodos with userId', { userId })
  const allTodos = await todoAccess.getAllTodos(userId)
  logger.info('returning allTodos', allTodos)
  return allTodos
}

export async function setOfTodos(jwtToken: string, limit: string, nextKey?: string): Promise<Object> {
  
  let mySetOfTodos: object
  logger.info('calling pareUserId', jwtToken)
  const userId = parseUserId(jwtToken)
  logger.info('calling getAllTodos with userId', { userId })
  if(nextKey){
    mySetOfTodos = await todoAccess.setOfTodos(userId, limit, nextKey)
  }
  else{
    mySetOfTodos = await todoAccess.setOfTodos(userId, limit)
  }
  logger.info('returning setOfTodos', { mySetOfTodos })
  return mySetOfTodos
}

export async function createTodoItem(newTodo: CreateTodoRequest,jwtToken: string): Promise<TodoItem> {
  const userId = parseUserId(jwtToken)
  const todoId = uuid.v4()

  return await todoAccess.createTodoItem({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    name: newTodo.name,
    reporter: newTodo.reporter,
    dueDate: newTodo.dueDate,
    done: false
  })

}

export async function deleteTodoItem(todoId: string, jwtToken: string): Promise<String> {
  const userId = parseUserId(jwtToken)
  
  return await todoAccess.deleteTodoItem(userId, todoId)

}

export async function updateTodoItem(todoId: string, updatedTodo: UpdateTodoRequest, jwtToken: string): Promise<String> {
  const userId = parseUserId(jwtToken)
  
  return await todoAccess.updateTodoItem(userId, todoId, updatedTodo)

}

export async function generateUploadUrl(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken)
  logger.info('requesting a signed url')
  return await todoAccess.generateUploadUrl(todoId, userId)

}