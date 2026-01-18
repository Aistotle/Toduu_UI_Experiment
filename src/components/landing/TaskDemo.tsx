import { useEffect, useState } from 'react';
import { TaskItem } from './TaskItem';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: 1, text: 'Morning coffee', completed: true },
  { id: 2, text: 'Review the proposal', completed: false },
  { id: 3, text: 'Call Sarah back', completed: false },
  { id: 4, text: 'Evening walk', completed: false },
];

export function TaskDemo() {
  const [tasks, setTasks] = useState(initialTasks);
  const [animatingTaskId, setAnimatingTaskId] = useState<number | null>(null);

  useEffect(() => {
    // Auto-complete "Review the proposal" after 1.5s
    const timer = setTimeout(() => {
      setAnimatingTaskId(2);

      // Mark as completed after animation
      setTimeout(() => {
        setTasks(prev =>
          prev.map(task =>
            task.id === 2 ? { ...task, completed: true } : task
          )
        );
        setAnimatingTaskId(null);
      }, 400);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-surface rounded-lg shadow-1 p-6 w-full max-w-sm">
      <div className="space-y-1">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            text={task.text}
            completed={task.completed || animatingTaskId === task.id}
            animateCompletion={animatingTaskId === task.id}
          />
        ))}
      </div>
    </div>
  );
}
