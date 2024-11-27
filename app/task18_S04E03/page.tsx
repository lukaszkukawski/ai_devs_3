import TaskLayout from '../components/TaskLayout';
import content from './content';
import SolutionComponent from './solutionComponent';

export default function Zadanie18() {

  return (
    <TaskLayout
      title="Zadanie 18"
      content={content}
      solution={<SolutionComponent />}
    />
  );
} 