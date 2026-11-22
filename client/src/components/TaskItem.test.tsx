import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaskItem } from './TaskItem.js';
import { Task } from '../types.js';

const task: Task = {
  id: 'a1',
  title: 'Write the README',
  description: 'Include the API table',
  status: 'todo',
  dueDate: null,
  createdAt: '2026-11-22T10:00:00.000Z',
  updatedAt: '2026-11-22T10:00:00.000Z',
};

describe('TaskItem', () => {
  it('renders the task and calls the supplied actions', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    render(<TaskItem task={task} onToggle={onToggle} onDelete={onDelete} />);

    expect(screen.getByText('Write the README')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
    expect(onToggle).toHaveBeenCalledWith({ ...task, status: 'done' });

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledWith('a1');
  });

  it('offers Reopen for a completed task', () => {
    render(
      <TaskItem
        task={{ ...task, status: 'done' }}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Reopen' })).toBeInTheDocument();
  });
});
