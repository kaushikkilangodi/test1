import styled, { css } from 'styled-components';

interface RowProps {
  type?: 'horizontal' | 'vertical' | 'title' | 'footer';
  size?:
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xLarge'
    | 'xxLarge'
    | 'threeXLarge'
    | 'fourXLarge';
  $contentposition?: 'spaceBetween' | 'center' | 'left' | 'right';
}

const typeStyles = {
  horizontal: css`
    align-items: center;
  `,
  vertical: css`
    justify-content: space-between;
    flex-direction: column;
    gap: 0rem;
  `,
  title: css`
    align-items: center;
    border-bottom: 2px solid var(--color-brand-500);
    position: sticky;
    top: -2.5%;
    backdrop-filter: blur(10px);
    z-index: 5;
  `,
  footer: css`
    align-items: center;
    padding-block: 1rem;
    border-top: 2px solid var(--color-brand-500);
    position: sticky;
    bottom: -2.5%;
    backdrop-filter: blur(10px);
    z-index: 5;
  `,
};

const sizeStyles = {
  xsmall: css`
    line-height: 0;
  `,
  small: css`
    gap: 0.25rem;
  `,

  medium: css`
    gap: 1rem;
  `,

  large: css`
    gap: 1.5rem;
  `,

  xLarge: css`
    gap: 2rem;
  `,

  xxLarge: css`
    gap: 4rem;
  `,

  threeXLarge: css`
    gap: 6rem;
  `,

  fourXLarge: css`
    gap: 10rem;
  `,
};

const contentPositionStyles = {
  spaceBetween: css`
    justify-content: space-between;
  `,
  center: css`
    justify-content: center;
    align-items: center;
  `,
  left: css`
    justify-content: flex-start;
    align-items: flex-start;
  `,
  right: css`
    justify-content: flex-end;
  `,
};

const Row = styled.div<RowProps>`
  display: flex;
  ${(props) => typeStyles[props.type || 'horizontal']}
  ${(props) => sizeStyles[props.size || 'medium']}
  ${(props) => contentPositionStyles[props.$contentposition || 'spaceBetween']}

  @media (max-width: 768px) {
    ${(props) => sizeStyles[props.size || 'medium']}
  }

  @media (max-width: 576px) {
    ${(props) => sizeStyles[props.size || 'small']}
  }
`;

Row.defaultProps = {
  type: 'horizontal',
  size: 'medium',
  $contentposition: 'spaceBetween',
};

export default Row;
