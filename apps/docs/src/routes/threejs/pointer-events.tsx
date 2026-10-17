import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { DocTable } from '../../components/DocTable';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';

import Pointer from '../../examples/threejs/pointer';
import pointerCode from '../../examples/threejs/pointer.tsx?raw';

const EVENT: [string, string][] = [
  ['nativeEvent', 'The DOM event on the <canvas>.'],
  ['intersection', "three's Intersection for the nearest hit that led here: point, distance, face, uv, object."],
  ['object', 'The object whose handler is running.'],
  ['pointer, ray, camera', 'The pointer in normalized device coordinates, the ray cast, and the Active camera.'],
  ['pointerId, button, buttons, altKey, ctrlKey, metaKey, shiftKey', 'Copied from the DOM event.'],
  ['stopPropagation()', 'Ends delivery: no object above or behind gets the event.'],
  ['setPointerCapture(), releasePointerCapture()', "Send the pointer's later moves and its up to this object, hit or not."],
];

export default function ThreejsPointerEvents() {
  return (
    <article class="docs-page">
      <Title>Pointer events · threejs · slopkit</Title>
      <p class="docs-eyebrow">threejs</p>
      <h1>Pointer events</h1>
      <p class="docs-lead">
        Object components take <code>onClick</code>, <code>onContextMenu</code>, <code>onPointerDown</code>,{' '}
        <code>onPointerUp</code>, <code>onPointerMove</code>, <code>onPointerOver</code>, <code>onPointerOut</code>,{' '}
        <code>onPointerEnter</code>, <code>onPointerLeave</code> and <code>onWheel</code>.
      </p>

      <H2 id="usage">Usage</H2>
      <Example component={Pointer} code={pointerCode} />

      <H2 id="hit-testing">Hit-testing</H2>
      <p>
        On each pointer event over the canvas, a ray is cast from the Active camera through the pointer, against the objects with
        a handler and everything under them. An object with no handler neither gets events nor blocks them; a hit on one goes to
        the nearest object above it that has a handler.
      </p>

      <H2 id="delivery">Delivery</H2>
      <p>
        Every hit gets the event, nearest first: the hit object, then its ancestors with handlers, then the next hit. Each object
        gets an event once. <code>event.stopPropagation()</code> ends delivery.
      </p>
      <ul>
        <li>
          <code>onPointerEnter</code> and <code>onPointerLeave</code> run on each object that becomes hovered or stops being
          hovered, and don't bubble. <code>onPointerOver</code> and <code>onPointerOut</code> run when the nearest hovered object
          changes, and bubble.
        </li>
        <li>Handlers are read when their event is delivered, so they can change. They're never written to the object.</li>
      </ul>

      <H2 id="drags">Drags</H2>
      <p>
        Call <code>event.setPointerCapture()</code> in <code>onPointerDown</code>. Until the pointer is lifted, its moves reach
        the object even off it, with no <code>intersection</code> when they miss.
      </p>
      <CodeBlock
        code={`<T.Mesh
  onPointerDown={(event) => event.setPointerCapture()}
  onPointerMove={(event) => {
    if (event.buttons) drag(event.intersection?.point ?? event.ray.at(5, new Vector3()));
  }}
/>`}
      />

      <H2 id="event">The event</H2>
      <DocTable head={['Member', 'Meaning']} rows={EVENT.map(([member, meaning]) => [<code>{member}</code>, meaning])} />
    </article>
  );
}
