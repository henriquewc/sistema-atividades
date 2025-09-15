import { ClientForm } from '../ClientForm';

export default function ClientFormExample() {
  return (
    <div className="p-4">
      <ClientForm 
        onSubmit={(data) => console.log('Cliente cadastrado:', data)}
      />
    </div>
  );
}