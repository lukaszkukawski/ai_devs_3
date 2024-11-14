import TaskLayout from '../components/TaskLayout';
import content from './content';
import SolutionComponent from './solutionComponent';

export default function Zadanie8() {

  return (
    <TaskLayout
      title="Zadanie 9"
      content={content}
      solution={<SolutionComponent />}
    />
  );
} 