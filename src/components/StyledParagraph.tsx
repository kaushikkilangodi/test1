import styled from 'styled-components';

export const StyledParagraph = styled.p<{height:string}>`
  font-family: Helvetica;
  font-size: 14px;
  font-weight: 400;
  line-height: 13.22px;
  text-transform: none;
  color: #8b9195;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.height || '100vh'};
`;
