import styled, { css } from "styled-components";

namespace Styles {

    export const FONT_SMALL = 16;
    export const FONT_MIDIUM = 22;
    export const FONT_LARGE = 32;

    export const CSS_LABEL = css`
        display: inline-block;
        font-weight: 600;
        text-align: center;
        color: black;
        box-sizing: border-box;
    `;
    
    export const CSS_LABEL_SMALL = css`
        ${CSS_LABEL}
        height: 22px;
        font-size: ${FONT_SMALL}px;
        line-height: 22px;
    `;

    export const CSS_LABEL_MIDIUM = css`
        ${CSS_LABEL}
        height: 30px;
        font-size: ${FONT_MIDIUM}px;
        line-height: 26px;
    `;

    export const CSS_BUTTON_DISABLE = css`
        pointer-events: none;
        opacity: 0.5;
    `;
}
export default Styles;

export const _WrapperFrame = styled.div`
    display: inline-block;
    width: 100%;
    height: 100%;
`;

export const _Object = styled.div`
    display: inline-block;
`;

export const _Record = styled.div`
    display: inline-block;
    width: 100%;
`;

export const _CSS_LABEL_SMALL = css`
    display: inline-block;
    height: 30px;
    font-size: 18px;
    font-weight: 600;
    color: black;
    line-height: 18px;
`;


export const _CSS_LABEL_MIDIUM = css`
    display: inline-block;
    height: 30px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    color: black;
    line-height: 24px;
    box-sizing: border-box;
`;

export const _CSS_DISABLE = css`
    opacity: 0.6;
    pointer-events: none;
`;

