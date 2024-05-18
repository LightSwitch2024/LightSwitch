import style from 'styled-components';

export const SpinnerWrapper = style.div`
display: flex;
width: 100%;
height: 100%;
z-index: 150;
background-color: rgba(91, 91, 91, 0.458);
justify-content: center;
align-items: center;
position: fixed;
overflow: hidden;
`;

export const Spinner = style.img`
width: 150px;
height: 150px;
`;
