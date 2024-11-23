import TaskLayout from '../components/TaskLayout';
import content from './content';
import SolutionComponent from './solutionComponent';

export default function Zadanie14() {

  return (
    <TaskLayout
      title="Zadanie 15"
      content={content}
      solution={<SolutionComponent />}
    />
  );
} 