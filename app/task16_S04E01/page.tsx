import TaskLayout from '../components/TaskLayout';
import content from './content';
import SolutionComponent from './solutionComponent';

export default function Zadanie16() {

  return (
    <TaskLayout
      title="Zadanie 16"
      content={content}
      solution={<SolutionComponent />}
    />
  );
} 