"use client"
import React from 'react';

import { Text, Button } from '@repo/ds';

import './DependencyFallback.scss';

type DependencyFallbackPropsButton = {
  label: string;
  onClick: () => void;
};

type DependencyFallbackProps = {
  button?: DependencyFallbackPropsButton;
  message?: string;
  resourceName?: string;
  dependencyName?: string;
};

const DependencyFallback: React.FC<DependencyFallbackProps> = ({
  button,
  message,
  resourceName = 'Resource',
  dependencyName = 'Dependency',
}) => {
  const resultMessage = message
    ? message
    : `No list of ${dependencyName} were found. Please create a ${dependencyName} before creating a ${resourceName}!!`;
  return (
    <div className="dependency-fallback">
      <Text>{resultMessage}</Text>
      {button && (
        <Button
          onClick={button.onClick}
          context="primary"
          className="dependency-fallback__button">
          {button.label}
        </Button>
      )}
    </div>
  );
};

export default DependencyFallback;