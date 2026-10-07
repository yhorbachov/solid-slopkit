import { Title } from '@solidjs/meta';
import Counter from '../components/Counter';
import logo from '../logo.svg';
import { Button } from '@slopkit/ui';

export default function Home() {
  const handleClick = () => {
    console.log('Click');
  };
  return (
    <main>
      <Title>Home - Solid App</Title>
      <img src={logo} class="logo" alt="Solid logo" />
      <h1>Hello Solid!</h1>
      <Counter />
      <p>
        Edit <code>src/routes/index.tsx</code> and save to reload.
      </p>
      <Button as="a" ref={(el) => {}} onClick={handleClick}>
        Click me
      </Button>
      <a href="https://v2.solidjs.com/" target="_blank" rel="noopener noreferrer">
        Learn Solid
      </a>
    </main>
  );
}
