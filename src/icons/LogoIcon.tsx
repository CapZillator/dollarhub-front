import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

function LogoIcon(props: any) {
  let iconClass, iconPathClass, iconPathClass2;
  switch (props.type){
    case "head": {
      iconClass = "Logo-icon";
      iconPathClass = "Logo-icon-path1";
      iconPathClass2 = "Logo-icon-path2";
    }; break;
    case "footer": {
      iconClass = "Logo-icon-footer";
      iconPathClass = "Logo-icon-footer-path1";
      iconPathClass2 = "Logo-icon-footer-path2";
    }; break;
    case "main": {
      iconClass = "Logo-icon-main";
      iconPathClass = "Logo-icon-main-path1";
      iconPathClass2 = "Logo-icon-main-path2";
    }; break;
    default: {
      iconClass = "Logo-icon";
      iconPathClass = "Logo-icon-path1";
      iconPathClass2 = "Logo-icon-path2";
    }
  }

  return (
    <SvgIcon className={iconClass}>
      <svg
        width={100}
        height={100}
        viewBox="0 0 110 110"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.03 1.643v15.241h5.485V5.614h4.038a5.28 6.658 0 0 1 5.28 6.657 5.28 6.658 0 0 1-5.28 6.658H3.031v3.96h2v-.003h8.914a11.657 10.621 0 0 0 11.657-10.622A11.657 10.621 0 0 0 13.945 1.643z"
          className={iconPathClass}
        />
        <path
          d="M.48 20.708v4.725h7.311v-1.52H5.045v.003H1.95v-3.208h-.736z"
          className={iconPathClass2}
        />
      </svg>
    </SvgIcon>
  );
}

export default LogoIcon;