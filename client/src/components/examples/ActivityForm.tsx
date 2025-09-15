import { ActivityForm } from '../ActivityForm';

export default function ActivityFormExample() {
  return (
    <div className="p-4">
      <ActivityForm 
        onSubmit={(data) => console.log('Atividade cadastrada:', data)}
      />
    </div>
  );
}