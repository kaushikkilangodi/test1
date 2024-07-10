import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  width?: string;
}

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputContainer = styled.div<{ width?: string }>`
  position: relative;
  margin: 24px 0;
  background-color:rgba(217, 217, 217, 1);
  border-radius:12px;
  width: ${(props) => props.width || '350px'};
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px; /* Increased padding */
  font-size: 12px; /* Increased font size */
  border: 1px solid rgba(217, 217, 217, 1); /* Increased border width */
  border-radius: 5px;
  height: 53px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(10, 17, 23, 0.4);
  }
`;

const InputLabel = styled.label`
  position: absolute;
  top: -12px; /* Adjusted for larger font size */
  left: 12px; /* Adjusted for increased padding */
  background-color: #fff;
  padding: 0 5px;
  font-size: 14px; /* Increased font size */
  color: #000; /* Black label color */
  transition:
    top 0.3s ease,
    font-size 0.3s ease,
    color 0.3s ease;
  pointer-events: none;
`;

const RadioInput = styled.input`
  margin-right: 8px;
`;

const RadioLabel = styled.label`
  font-size: 16px;
  color: #000;
`;

const Input: React.FC<InputProps> = ({
  label,
  width,
  type = 'text',
  ...rest
}) => {
  return (
    <CenteredContainer>
      {type === 'radio' ? (
        <>
          <RadioInput type="radio" {...rest} />
          <RadioLabel>{label}</RadioLabel>
        </>
      ) : (
        <InputContainer width={width}>
          <>
            <InputField type={type} {...rest} />
            <InputLabel>{label}</InputLabel>
          </>
        </InputContainer>
      )}
    </CenteredContainer>
  );
};

export default Input;
