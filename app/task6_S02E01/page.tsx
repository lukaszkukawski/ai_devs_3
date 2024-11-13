import { useEffect } from 'react';
import TaskLayout from '../components/TaskLayout';
import content from './content';
import SolutionComponent from './solutionComponent';

const apiKey = process.env.AI_DEVS_API_KEY;


export default function Zadanie6() {

  return (
    <TaskLayout
      title="Zadanie 6"
      content={content}
      solution={<SolutionComponent />}
    />
  );
} 