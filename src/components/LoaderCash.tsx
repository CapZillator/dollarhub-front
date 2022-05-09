import React from 'react';
import DollarLoaderIcon from '../icons/DollarLoaderIcon';
import RubleLoaderIcon from '../icons/RubleLoaderIcon';
import '../styles/Loader.scss';

function LoaderCash() {
  return (
    <div className="Loader-cash-wrapper">
        <DollarLoaderIcon curClass="Loader-cash-dollar-el" backgroundClass="Loader-cash-background" wrapperClass="Loader-cash-dollar-wrapper"/>
        <RubleLoaderIcon curClass="Loader-cash-ruble-el" backgroundClass="Loader-cash-background" wrapperClass="Loader-cash-ruble-wrapper"/>
    </div>
  );
}

export default LoaderCash;