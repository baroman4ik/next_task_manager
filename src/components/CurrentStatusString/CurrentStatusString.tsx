import React from 'react';
import {Task} from '@/store/slices/tasksSlice';
import {formatTimeDifference} from "@/utils/helters";

interface CurrStatusStringProps {
  task: Task;
}

const CurrStatusString: React.FC<CurrStatusStringProps> = ({task}) => {
  return task.status !== "completed" && task.dueDate &&
    (() => {
      const diff = formatTimeDifference(task.dueDate, task.status);
      if (diff.text && !diff.isOverdue) {
        return (
          <span className={`ml-1 ${diff.isWarning ? 'text-amber-600' : 'text-gray-500'}`}>(осталось: {diff.text})</span>
        );
      } else if (diff.isOverdue) {
        return <span className="ml-1 text-red-500">(просрочено)</span>;
      }
      return null;
    })()

};

export default CurrStatusString;