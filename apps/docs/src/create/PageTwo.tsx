import * as A from './cards/two-a';
import * as B from './cards/two-b';
import * as C from './cards/two-c';

// The second preview page: product and developer tools. Seven columns.
export function PageTwo() {
  return (
    <div class="create-grid">
      <div class="create-col">
        <A.Column1 />
      </div>
      <div class="create-col">
        <A.Column2 />
      </div>
      <div class="create-col">
        <A.Column3 />
      </div>
      <div class="create-col">
        <B.Column4 />
      </div>
      <div class="create-col">
        <B.Column5 />
      </div>
      <div class="create-col">
        <C.Column6 />
      </div>
      <div class="create-col">
        <C.Column7 />
      </div>
    </div>
  );
}
