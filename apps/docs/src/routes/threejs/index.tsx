import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';

import FirstScene from '../../examples/threejs/first-scene';
import firstSceneCode from '../../examples/threejs/first-scene.tsx?raw';

const RELEASES_URL = 'https://github.com/yhorbachov/solid-slopkit/releases';

export default function ThreejsOverview() {
  return (
    <article class="docs-page">
      <Title>threejs · slopkit</Title>
      <p class="docs-eyebrow">threejs</p>
      <h1>Overview</h1>
      <p class="docs-lead">
        <code>@solid-slopkit/threejs</code> describes three.js scenes with SolidJS 2 components. Each component creates its
        three.js object once and keeps it in sync through fine-grained bindings: there is no custom renderer and no re-render.
      </p>

      <H2 id="installation">Installation</H2>
      <p>
        Like the other slopkit packages, it isn't published to npm. Each version is a tarball attached to a{' '}
        <a href={RELEASES_URL}>GitHub Release</a>. Replace <code>0.0.1</code> with the version you want.
      </p>
      <CodeBlock
        lang="bash"
        code={`pnpm add three @types/three ${RELEASES_URL}/download/v0.0.1/solid-slopkit-threejs-0.0.1.tgz`}
      />
      <p>
        It needs <code>solid-js</code> and <code>@solidjs/web</code> 2.x and <code>three</code> r171 or later, which it takes as
        peer dependencies, as it does <code>@types/three</code> for TypeScript.
      </p>

      <H2 id="first-scene">A first scene</H2>
      <p>
        <code>&lt;Canvas&gt;</code> makes the <code>&lt;canvas&gt;</code>, the renderer, the scene and a default camera, and fills
        its parent, so give the parent a size. Inside it, every member of <code>T</code> wraps one three.js class: a mesh, its
        geometry and its material are components nested the way the objects attach. Hover the box, and drag to orbit.
      </p>
      <Example component={FirstScene} code={firstSceneCode} />
      <p>
        The Canvas renders a <strong>Frame</strong> only when something changes: here, a prop written on hover, or the camera
        moving. An idle scene draws nothing.
      </p>

      <H2 id="webgpu">WebGPU</H2>
      <p>
        The default renderer is a <code>WebGLRenderer</code>. To render with WebGPU, pass the factory from the <code>webgpu</code>{' '}
        subpath. It resolves once the renderer has initialized, and falls back to WebGL 2 where the browser has no WebGPU. Scenes
        don't change.
      </p>
      <CodeBlock
        code={`import { webgpuRenderer } from '@solid-slopkit/threejs/webgpu';

<Canvas renderer={webgpuRenderer({ antialias: true })}>…</Canvas>`}
      />

      <H2 id="server-rendering">Server rendering</H2>
      <p>
        On the server a Canvas renders only its <code>&lt;canvas&gt;</code> and its <code>fallback</code>. The scene mounts in the
        browser once the page has hydrated, so nothing in it runs on the server. The <code>fallback</code> goes after the{' '}
        <code>&lt;canvas&gt;</code> and stays until the first Frame has rendered; lay it over the canvas with your own CSS. The
        examples on these pages are rendered that way.
      </p>

      <H2 id="for-agents">For coding agents</H2>
      <p>
        The package ships its own docs for agents: task guides at <code>node_modules/@solid-slopkit/threejs/skills/</code> and a
        reference per area, indexed in <code>node_modules/@solid-slopkit/threejs/dist/source/llms.md</code>.
      </p>

      <H2 id="next">Next</H2>
      <ul>
        <li>
          <a href="/threejs/scene-components">Scene components</a>: props, Partial values, Attach, Rebuild and existing objects.
        </li>
        <li>
          <a href="/threejs/animation">Animation</a>, <a href="/threejs/cameras">Cameras and controls</a>,{' '}
          <a href="/threejs/pointer-events">Pointer events</a>, <a href="/threejs/assets">Assets</a>.
        </li>
      </ul>
    </article>
  );
}
