import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../../design/styles";
import DatabaseUtil from "../../utils/databaseUtil";

type FieldProps = {
    no: number
    name: string,
};

const DataViewerRoot = (props: {
}) => {

    const [fieldList, setFieldList] = useState<FieldProps[]>([]);

    useEffect(() => {
        findFieldList().then((res) => {
            setFieldList(res);
        });
    }, []);

    const columnList = fieldList.map((field, i) => {

        return (
            <_Column key={i} width={200}>{field.name}</_Column>
        );
    });

    return (
        <_Wrap>
            <_Button isEnable={true}>戻る</_Button>
            <_MessageFrame><_Message>
                aaa
            </_Message></_MessageFrame>
            <_OperationRecord>
                <_Switch isFocus={false}>テーブル</_Switch>
                <_Switch isFocus={false}>統計</_Switch>
                <_Switch isFocus={false}>ツリー</_Switch>
            </_OperationRecord>
            <_TableFrame>
                <_Record>{columnList}</_Record>
            </_TableFrame>
        </_Wrap>
    );
}

export default DataViewerRoot;


const findFieldList = async () => {
    const sql = `SELECT no, name FROM fieldtbl WHERE contents = 9 ORDER BY no`;
    const response = await DatabaseUtil.sendQueryRequestToAPI('select', sql);
    const results = await response.json();
    return results as FieldProps[];
};

const _Wrap = styled.div`
    display: inline-block;
    width: 100%;
    max-width: 960px;
    height: 100%;
    background-color: #f3f3f328;
    text-align: center;
`;

const _TableFrame = styled.div`
    display: inline-block;
    width: calc(100% - 10px);
    height: calc(100% - 200px);
    background-color: #a0a0a0;
    text-align: left;
    overflow: auto;
`;

const _Record = styled.div<{
}>`
    display: inline-block;
    min-width: 100%;
    height: 30px;
    background-color: #a5d1ac;
    white-space: nowrap;
`;

const _Column = styled.div<{
    width: number;
}>`
    display: inline-block;
    width: ${props => props.width}px;
    height: 30px;
    background-color: #bacfbd;
    border: solid 1px #0000006f;
    box-sizing: border-box;
    font-size: 18px;
    color: #474747;
    padding: 0 0 0 10px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
`;


const _Button = styled.div<{
    isEnable: boolean;
}>`
    display: inline-block;
    width: 150px;
    height: 30px;
    font-size: 18px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    color: #5f5856;
    background-color: #ffffff78;
    border: 1px solid #00000084;
    border-radius: 6px;
    text-align: center;
    box-sizing: border-box;
    margin: 5px 0 0 0;
    ${props => props.isEnable ? '' : Styles.CSS_BUTTON_DISABLE}
    &: hover{
        background-color: #ffffff96;
    }
`;

const _Switch = styled.div<{
    isFocus: boolean;
}>`
    display: inline-block;
    width: 150px;
    height: 30px;
    font-size: 18px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    color: #5f5856;
    background-color: #ffffff78;
    border: 1px solid #00000084;
    border-radius: 6px;
    text-align: center;
    box-sizing: border-box;
    margin: 5px 0 0 0;
    ${props => !props.isFocus ? '' : css`
        background-color: #f3f162e8;
    `}
    &: hover{
        background-color: #ffffff96;
        ${props => !props.isFocus ? '' : css`
            background-color: #f3f162e8;
        `}
    }
`;

const _MessageFrame = styled.div`
    display: inline-block;
    width: 100%;
    height: 80px;
    background-color: #9b8f8f28;
    text-align: left;
    margin: 5px 0 0 0;
`;

const _Message = styled.div<{
}>`
    display: inline-block;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    margin: 5px 0 0 5px;
    font-size: 18px;
    /* font-weight: 600; */
    font-family: 'Noto Serif JP', serif;
    background-color: #0000001d;
    border-radius: 4px;
    padding: 5px;
    box-sizing: border-box;
    color: #ffffff;
    text-align: left;
`;

const _OperationRecord = styled.div<{
}>`
    display: inline-block;
    min-width: 100%;
    height: 40px;
    /* background-color: #a5d1ac; */
    white-space: nowrap;
`;