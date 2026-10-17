import { render } from '@solidjs/testing-library';
import { captureArtifact } from '@solidjs/diagnostics';
import type { JSX } from '@solidjs/web';
import { createSignal, flush, Show } from 'solid-js';
import { BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D } from 'three';
import { describe, expect, test } from 'vitest';
import { stubFactory } from '../../test/harness';
import { Canvas } from '../canvas';
import { sceneComponent } from '.';

const T = {
  Mesh: sceneComponent(Mesh),
  StandardMesh: sceneComponent(Mesh<BoxGeometry, MeshStandardMaterial>),
  MeshBasicMaterial: sceneComponent(MeshBasicMaterial),
  MeshStandardMaterial: sceneComponent(MeshStandardMaterial),
  DirectionalLight: sceneComponent(DirectionalLight),
};

function mount(scene: () => JSX.Element) {
  const utils = render(() => <Canvas renderer={stubFactory().factory}>{scene()}</Canvas>);
  flush();
  return utils;
}

describe('Path props', () => {
  test('set one field of a math object, leaving the others and the object itself', () => {
    const [y, setY] = createSignal(1);
    let mesh!: Mesh;
    mount(() => <T.Mesh ref={mesh} position={[5, 0, 7]} position-y={y()} />);
    const position = mesh.position;
    expect(mesh.position.toArray()).toEqual([5, 1, 7]);
    setY(2);
    flush();
    expect(mesh.position.toArray()).toEqual([5, 2, 7]);
    expect(mesh.position).toBe(position);
  });

  test('apply the copy rules to the field they set', () => {
    let light!: DirectionalLight;
    let mesh!: Mesh<BoxGeometry, MeshStandardMaterial>;
    mount(() => (
      <>
        <T.DirectionalLight ref={light} shadow-mapSize={[1024, 2048]} />
        <T.StandardMesh ref={mesh} material-color="hotpink">
          <T.MeshStandardMaterial />
        </T.StandardMesh>
      </>
    ));
    expect(light.shadow.mapSize.toArray()).toEqual([1024, 2048]);
    expect(mesh.material.color.getHexString()).toBe('ff69b4');
  });

  test('reach the material a child attaches after them, and the one that replaces it', () => {
    const [standard, setStandard] = createSignal(true);
    const [opacity, setOpacity] = createSignal(0.5);
    let mesh!: Mesh;
    mount(() => (
      <T.Mesh ref={mesh} material-opacity={opacity()}>
        <Show when={standard()} fallback={<T.MeshBasicMaterial />}>
          <T.MeshStandardMaterial opacity={1} />
        </Show>
      </T.Mesh>
    ));
    expect(mesh.material).toBeInstanceOf(MeshStandardMaterial);
    expect((mesh.material as MeshStandardMaterial).opacity).toBe(0.5);

    setStandard(false);
    flush();
    expect(mesh.material).toBeInstanceOf(MeshBasicMaterial);
    expect((mesh.material as MeshBasicMaterial).opacity).toBe(0.5);

    setOpacity(0.25);
    flush();
    expect((mesh.material as MeshBasicMaterial).opacity).toBe(0.25);
  });

  test('wait for an empty property to be filled', () => {
    class Holder extends Object3D {
      target: { size: number } | null = null;
    }
    const Hold = sceneComponent(Holder);
    let holder!: Holder;
    mount(() => <Hold ref={holder} target-size={3} />);
    expect(holder.target).toBeNull();
  });

  test('throw for a property the Instance does not have', () => {
    expect(() => mount(() => <T.Mesh {...({ 'missing-x': 1 } as object)} />)).toThrow(/"missing" is undefined/);
  });

  test('throw for a path more than one level deep', () => {
    expect(() => mount(() => <T.Mesh {...({ 'material-color-r': 1 } as object)} />)).toThrow(/one level deep/);
  });

  test('are typed one level deep from the declared types', () => {
    void (() => (
      <>
        <T.Mesh position-x={1} rotation-order="XYZ" scale-z={2} material-opacity={0.5} geometry-name="box" />
        <T.StandardMesh material-color={0xff0000} material-roughness={0.5} />
      </>
    ));
    // @ts-expect-error a field takes its own type
    void (() => <T.Mesh position-y="1" />);
    // @ts-expect-error and so does one reached through a material
    void (() => <T.Mesh material-opacity="half" />);
    // TypeScript never checks a JSX attribute with a dash it doesn't know (that is how `data-*` passes), so a
    // misspelled field such as `position-w` gets through the types; the runtime check below catches it.
  });

  test('throw for a field the object does not have, except on a plain record', () => {
    expect(() => mount(() => <T.Mesh {...({ 'position-w': 1 } as object)} />)).toThrow(/Vector3 has no "w"/);
    let mesh!: Mesh;
    mount(() => <T.Mesh ref={mesh} userData-id={7} />);
    expect(mesh.userData).toEqual({ id: 7 });
  });
});

describe('Path prop diagnostics', () => {
  test('a change re-runs only its own binding', async () => {
    const [y, setY] = createSignal(0);
    let mesh!: Mesh;
    mount(() => <T.Mesh ref={mesh} position={[1, 0, 0]} position-y={y()} scale={2} />);
    const { artifact } = await captureArtifact(
      async () => {
        setY(3);
        flush();
        await Promise.resolve();
      },
      { scenario: 'path-prop-change' },
    );
    expect(artifact).toHaveNoDiagnostics({ allow: ['HOT_SCOPE_TIME'] });
    expect(artifact).toStayWithinRerunBudget(1);
    expect(mesh.position.toArray()).toEqual([1, 3, 0]);
  });
});
