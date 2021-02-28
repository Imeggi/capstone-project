export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  reporter: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
