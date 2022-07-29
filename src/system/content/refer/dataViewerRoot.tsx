import { useEffect, useState } from "react";
import styled from "styled-components";
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