import { createSignal, For } from 'solid-js';
import { Button, Notification } from '@solid-slopkit/ui';

interface Item {
  id: number;
  title: string;
}

export default function Corner() {
  const [items, setItems] = createSignal<Item[]>([]);
  let next = 1;

  const add = () => {
    const item = { id: next++, title: `Message ${next - 1}` };
    setItems((list) => [...list, item]);
    setTimeout(() => setItems((list) => list.filter((entry) => entry.id !== item.id)), 4000);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '16rem', overflow: 'hidden' }}>
      <Button size="sm" onClick={add}>
        Show a notification
      </Button>
      {/* A region the app owns: notifications stack in the corner and leave after four seconds. */}
      <div
        style={{
          position: 'absolute',
          right: '0.75rem',
          bottom: '0.75rem',
          display: 'flex',
          'flex-direction': 'column',
          gap: '0.5rem',
          width: '16rem',
        }}
      >
        <For each={items()}>{(item) => <Notification title={item.title}>It goes away on its own.</Notification>}</For>
      </div>
    </div>
  );
}
