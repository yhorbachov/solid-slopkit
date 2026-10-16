import * as A from './cards/one-a';
import * as B from './cards/one-b';
import * as C from './cards/one-c';

// The first preview page: a finance and home dashboard. Six columns; the third is twice as wide.
export function PageOne() {
  return (
    <div class="create-grid">
      <div class="create-col">
        <A.Column1 />
      </div>
      <div class="create-col">
        <A.Column2 />
      </div>
      <div class="create-col create-col-wide">
        <B.Column3 />
      </div>
      <div class="create-col">
        <B.Column4 />
      </div>
      <div class="create-col">
        <C.Column5 />
      </div>
      <div class="create-col">
        <C.Column6 />
      </div>
    </div>
  );
}
