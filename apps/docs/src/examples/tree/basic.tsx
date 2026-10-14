import { Tree } from '@solid-slopkit/ui';
import { files } from './data';

export default function Basic() {
  return <Tree data={files} aria-label="Files" defaultExpanded={['src']} />;
}
