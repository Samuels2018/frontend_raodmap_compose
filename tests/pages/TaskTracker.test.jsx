import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TaskTracker from '../../src/pages/TaskTracker/TaskTracker'

describe('TaskTracker', () => {
  it('renders the initial state correctly', () => {
    render(<TaskTracker />)
    
    expect(screen.getByText('Task Tracker')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument()
    expect(screen.getByText('No tasks yet. Add your first task above!')).toBeInTheDocument()
  })

  it('adds a new task when clicking the Add button', async () => {
    render(<TaskTracker />)
    const user = userEvent.setup()
    
    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: 'Add Task' })
    
    await user.type(input, 'Buy groceries')
    await user.click(addButton)
    
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.getByText('Pending Tasks')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('adds a new task when pressing Enter key', async () => {
    render(<TaskTracker />)
    
    const input = screen.getByPlaceholderText('Add a new task...')
    
    fireEvent.change(input, { target: { value: 'Walk the dog' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })
    
    expect(await screen.findByText('Walk the dog')).toBeInTheDocument()
  })

  it('does not add empty tasks', async () => {
    render(<TaskTracker />)
    const user = userEvent.setup()
    
    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: 'Add Task' })
    
    await user.type(input, '   ')
    await user.click(addButton)
    
    expect(screen.queryByTestId('task-item')).not.toBeInTheDocument()
    expect(screen.getByText('No tasks yet. Add your first task above!')).toBeInTheDocument()
  })

  it('toggles task completion status', async () => {
    render(<TaskTracker />)
    const user = userEvent.setup()
    
    // Add a task
    await user.type(screen.getByPlaceholderText('Add a new task...'), 'Learn React')
    await user.click(screen.getByRole('button', { name: 'Add Task' }))
    
    // Toggle completion
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(checkbox).toBeChecked()
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument()
    expect(screen.getByText('Learn React')).toHaveClass('line-through')
    
    // Toggle back
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('deletes a task', async () => {
    render(<TaskTracker />)
    const user = userEvent.setup()
    
    // Add a task
    await user.type(screen.getByPlaceholderText('Add a new task...'), 'Write tests')
    await user.click(screen.getByRole('button', { name: 'Add Task' }))
    
    // Delete the task - find by the red color class as a last resort
    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons.find(button => 
      button.className.includes('text-red-500')
    )
    
    await user.click(deleteButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Write tests')).not.toBeInTheDocument()
    })
    expect(screen.getByText('No tasks yet. Add your first task above!')).toBeInTheDocument()
  })


  it('shows correct styling for completed tasks', async () => {
    render(<TaskTracker />)
    const user = userEvent.setup()
    
    // Add and complete a task
    await user.type(screen.getByPlaceholderText('Add a new task...'), 'Completed task')
    await user.click(screen.getByRole('button', { name: 'Add Task' }))
    await user.click(screen.getByRole('checkbox'))
    
    const taskText = screen.getByText('Completed task')
    expect(taskText).toHaveClass('line-through')
    expect(taskText).toHaveClass('text-gray-500')
    
    const taskContainer = taskText.closest('div')
    expect(taskContainer).toHaveClass('bg-gray-50')
  })
})