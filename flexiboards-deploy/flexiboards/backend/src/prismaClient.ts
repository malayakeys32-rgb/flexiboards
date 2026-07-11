import AppLayout from "../layouts/AppLayout";
import TodoPanel from "../components/TodoPanel";

export default function Dashboard() {
  return (
    <AppLayout>
      <TodoPanel />
    </AppLayout>
  );
}
