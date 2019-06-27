import {use, h, render} from './preact';

export function init(spritejs, root) {
  use(spritejs);
  const layer = render(
    (
     <layer id="fglayer">
      <sprite pos={[100, 100]} size={[100, 100]} bgcolor="red"></sprite>
     </layer>
    ), root
  );
}
