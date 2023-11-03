import type { SVGProps } from 'react';

export const Info = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth={1.5}
    className='icon icon-tabler icon-tabler-info-circle'
    viewBox='0 0 24 24'
    {...props}
  >
    <path stroke='none' d='M0 0h24v24H0z' />
    <path d='M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M12 9h.01' />
    <path d='M11 12h1v4h1' />
  </svg>
);
