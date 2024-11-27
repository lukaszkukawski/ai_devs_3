import TaskLayout from '../components/TaskLayout';
import content from './content';
import SolutionComponent from './solutionComponent';

export default function Zadanie17() {

  return (
    <TaskLayout
      title="Zadanie 17"
      content={content}
      solution={<SolutionComponent />}
    />
  );
} 