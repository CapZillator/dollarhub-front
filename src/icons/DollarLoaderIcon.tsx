import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

function DollarLoaderIcon(props: any) {
  const curClass = props.curClass;
  const backgroundClass = props.backgroundClass;
  const wrapperClass = props.wrapperClass;
  

  return (
    <SvgIcon className={wrapperClass}>
      <svg
        width={100}
        height={100}
        viewBox="0 0 110 110"
        xmlns="http://www.w3.org/2000/svg"
      >
            <path
        style={{
            strokeWidth: 0.26458,
        }}
        className={backgroundClass}
        d="M1.192 5.754h5.534v10.072H1.192z"
        transform="matrix(1.8717 1.3644 -1.5788 1.0714 22.892 -3.596)"
        />
        <g transform="matrix(1.8717 1.3644 -1.5788 1.0714 12.044 -20.817)">
        <path
            style={{
            strokeWidth: 0.26458,
            }}
            className={backgroundClass}
            d="M10.72 10.165h5.141v9.632H10.72z"
        />
        <path
            transform="rotate(-90 13.29 14.981) scale(.26458)"
            d="M32.029 46.906v19.43h36.406v-19.43zm5.54 1.488h25.33a3.844 3.844 0 0 0 3.843 3.844v8.766a3.844 3.844 0 0 0-3.844 3.844h-25.33a3.844 3.844 0 0 0-3.844-3.844v-8.766a3.844 3.844 0 0 0 3.844-3.844z"
            style={{
            strokeWidth: 0.84471,
            }}
            className={curClass}
        />
        <path
            d="M11.484 14.981a1.806 1.806 0 0 0 1.806 1.806 1.806 1.806 0 0 0 1.806-1.806 1.806 1.806 0 0 0-1.806-1.806 1.806 1.806 0 0 0-1.806 1.806zm.35.137v-.276h.255c.037-.308.21-.508.523-.598l.156.38c-.214.073-.321.188-.321.344 0 .077.024.14.072.188a.24.24 0 0 0 .173.07c.07 0 .123-.023.16-.068.037-.046.083-.143.138-.293.06-.163.117-.292.17-.385a.587.587 0 0 1 .22-.222.624.624 0 0 1 .329-.084.7.7 0 0 1 .482.172c.128.115.203.28.226.496h.33v.276h-.329c-.037.36-.246.584-.629.67l-.11-.426c.24-.04.36-.17.36-.393 0-.104-.026-.18-.078-.229a.261.261 0 0 0-.186-.074c-.075 0-.132.025-.17.074a1.3 1.3 0 0 0-.149.326c-.053.152-.105.27-.156.357a.598.598 0 0 1-.54.287.718.718 0 0 1-.435-.142c-.129-.096-.208-.246-.236-.45z"
            style={{
            strokeWidth: 0.26458,
            }}
            className={curClass}
        />
        <circle
            transform="rotate(-90)"
            cx={-18.098}
            cy={13.366}
            r={0.44}
            style={{
            strokeWidth: 0.26458,
            }}
            className={curClass}
        />
        <circle
            transform="rotate(-90)"
            cx={-11.942}
            cy={13.366}
            r={0.44}
            style={{
            strokeWidth: 0.26458,
            }}
            className={curClass}
        />
        </g>
      </svg>
    </SvgIcon>
  );
}

export default DollarLoaderIcon;