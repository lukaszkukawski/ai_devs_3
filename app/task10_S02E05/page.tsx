import TaskLayout from '../components/TaskLayout';
import content from './content';
import SolutionComponent from './solutionComponent';

export default function Zadanie8() {

  return (
    <TaskLayout
      title="Zadanie 10"
      content={content}
      solution={<SolutionComponent />}
    />
  );
} 