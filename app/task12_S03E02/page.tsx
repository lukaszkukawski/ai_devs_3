import TaskLayout from '../components/TaskLayout';
import content from './content';
import SolutionComponent from './solutionComponent';

export default function Zadanie11() {

  return (
    <TaskLayout
      title="Zadanie 12"
      content={content}
      solution={<SolutionComponent />}
    />
  );
} 