import TaskLayout from '../components/TaskLayout';
import content from './content';
import solution from './solution';

export default function Zadanie1() {
  return (
    <TaskLayout
      title="Zadanie 1"
      content={content}
      solution={solution}
    />
  );
} 