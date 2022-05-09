import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

function SearchParamsIcon(props: any) {
  let iconClass = props.iconClass;
  let elClass = props.elClass;

  return (
    <SvgIcon className={iconClass}>
      <svg
        width={100}
        height={100}
        viewBox="0 0 110 110"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
      d="M19.277 17.278a9.609 9.609 0 0 1-1.933 1.934l5.22 5.22a1.011 1.367 45 0 0 1.682-.252 1.011 1.367 45 0 0 .251-1.682z"
      style={{
        strokeWidth: 0.36184,
      }}
      className={elClass}
    />
    <path
      d="M10.951 1.277a9.609 9.609 0 0 0-9.609 9.609 9.609 9.609 0 0 0 9.609 9.608 9.609 9.609 0 0 0 9.609-9.608 9.609 9.609 0 0 0-9.609-9.609zm0 1.506a8.103 8.103 0 0 1 8.104 8.103 8.103 8.103 0 0 1-8.104 8.103 8.103 8.103 0 0 1-8.103-8.103 8.103 8.103 0 0 1 8.103-8.103z"
      style={{
        strokeWidth: 0.22734,
      }}
      className={elClass}
    />
    <g
      transform="translate(-6.006 20.849)"
    >
      <path
        transform="scale(.26458)"
        d="M42.018-52.178a26.473 26.473 0 0 0-1.617 2.8h25.697a6.56 6.56 0 0 1-.154-1.4 6.56 6.56 0 0 1 .154-1.4zm36.893 0a6.56 6.56 0 0 1 .152 1.4 6.56 6.56 0 0 1-.152 1.4h8.871a26.473 26.473 0 0 0-1.617-2.8zM40.336-25.939a26.473 26.473 0 0 0 1.566 2.8h18.28a6.56 6.56 0 0 1-.153-1.4 6.56 6.56 0 0 1 .152-1.4zm32.66 0a6.56 6.56 0 0 1 .152 1.4 6.56 6.56 0 0 1-.152 1.4h13.283a26.473 26.473 0 0 0 1.566-2.8zM37.666-39.059a26.473 26.473 0 0 0-.049 1.488 26.473 26.473 0 0 0 .043 1.313h8.807a6.56 6.56 0 0 1-.153-1.4 6.56 6.56 0 0 1 .155-1.401zm21.615 0a6.56 6.56 0 0 1 .152 1.4 6.56 6.56 0 0 1-.152 1.4h31.238a26.473 26.473 0 0 0 .043-1.312 26.473 26.473 0 0 0-.049-1.488z"
        style={{
          strokeWidth: 0.98022,
        }}
        className={elClass}
      />
      <circle
        cx={19.183}
        cy={-13.434}
        r={1.368}
        style={{
          strokeWidth: 0.25113,
        }}
        className={elClass}
      />
      <circle
        transform="scale(-1)"
        cx={-13.99}
        cy={9.963}
        r={1.368}
        style={{
          strokeWidth: 0.25113,
        }}
        className={elClass}
      />
      <circle
        cx={17.618}
        cy={-6.492}
        r={1.368}
        style={{
          strokeWidth: 0.25113,
        }}
        className={elClass}
      />
    </g>
      </svg>
    </SvgIcon>
  );
}

export default SearchParamsIcon;