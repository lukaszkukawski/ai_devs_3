import TaskLayout from '../components/TaskLayout';
import content from './content';
import SolutionComponent from './solutionComponent';

export default function Zadanie13() {

  return (
    <TaskLayout
      title="Zadanie 13"
      content={content}
      solution={<SolutionComponent />}
    />
  );
} 