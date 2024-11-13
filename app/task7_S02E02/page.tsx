import TaskLayout from '../components/TaskLayout';
import content from './content';
import SolutionComponent from './solutionComponent';

export default function Zadanie7() {

  return (
    <TaskLayout
      title="Zadanie 7"
      content={content}
      solution={<SolutionComponent />}
    />
  );
} 