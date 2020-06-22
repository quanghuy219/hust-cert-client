import * as React from 'react';
import styled from 'styled-components';

const HustIconView = ({ className }) => {
  return (
    <div className={className}>
      <img id="hust-logo-img" src="/hust.png" alt="HUST" />
      <span>HUST</span>
    </div>
  );
};

export const HustIcon = styled(HustIconView)`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 5px;

  justify-content: center;
  align-items: center;

  > #hust-logo-img {
    height: 100%;
    width: auto;
    margin-right: 15px;
  }

  > span {
    display: block;
    color: white;
    font-size: 33px;
    font-weight: 600;
  }
`;
