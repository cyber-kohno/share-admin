import { useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../../design/styles";
import DatabaseUtil from "../../utils/databaseUtil";
import RegulationUtil from "../../utils/regulationUtil";
import SystemUtil from "../../utils/systemUtil";
import { GlobalContext } from "../entry/entry";
import FieldDetailDialog from "./fieldDetailDialog";
import FieldFrame from "./fieldFrame";
import RuleFrame from "./ruleFrame";

const Regulation = (props: {
    masterConteSeq: number;
}) => {
    const { store, setStore } = useContext(GlobalContext);

    const [isRule, setRule] = useState(true);
    const [isDispDialog, setDispDialog] = useState(false);
    const [focusIndex, setFocusIndex] = useState(0);
    const [ruleProps, setRuleProps] = useState<RegulationUtil.RuleProps>(RegulationUtil.getInitialRuleProps());

    const [fieldList, setFieldList] = useState<RegulationUtil.FieldProps[]>([RegulationUtil.createInitialField()]);
    const [maxFiledNo, setMaxFieldNo] = useState(-1);
    const [removeList, setRemoveList] = useState<number[]>([]);

    const isUpdate = props.masterConteSeq !== -1;

    useEffect(() => {
        const seq = props.masterConteSeq;
        if (seq !== -1) {
            DatabaseUtil.findMasterConte(seq).then((resConte) => {
                // ruleProps.name = res['name'];

                Object.keys(resConte).forEach((key) => {
                    if (!['seq', 'owner', 'createdy', 'updatedy'].includes(key)) {
                        const camelKey = SystemUtil.toCamelCase(key);
                        const value = resConte[key] ?? '';
                        // console.log(`key: [${key}], value: [${value}]`);
                        (ruleProps as any)[camelKey] = value;
                    }
                });
                setRuleProps({ ...ruleProps });

                DatabaseUtil.findMasterFieldList(seq).then((resFields) => {
                    const masterFieldList: RegulationUtil.FieldProps[] = [];
                    let maxFieldNo = -1;
                    resFields.forEach((field) => {
                        const fieldProps = RegulationUtil.createInitialField();
                        Object.keys(field).forEach((key) => {
                            if (!['conteseq'].includes(key)) {
                                const camelKey = SystemUtil.toCamelCase(key);
                                const value = field[key] ?? '';
                                console.log(`key: [${key}], value: [${value}]`);
                                (fieldProps as any)[camelKey] = value;
                                if (key === 'field_no' && maxFieldNo < Number(value)) {
                                    maxFieldNo = Number(value);
                                }
                            }
                        });
                        masterFieldList.push(fieldProps);
                    });
                    console.log(maxFieldNo);
                    setMaxFieldNo(maxFieldNo);
                    setFieldList(masterFieldList);
                });
                // findMasterFieldList(seq).then((fieldList)=> {
                //     fieldList.map(()=> {

                //     });
                // });
            });
        }
    }, []);

    const isInputOK = () => {
        return true;
    }

    const openDetailDialog = () => {
        setDispDialog(true);
    }

    const register = () => {
        if (store.user == null) return;
        const user = store.user;
        if (!isUpdate) {
            findNextConteSeq().then((contentsSeq) => {
                const list: string[] = [];
                // 新規登録時のコンテンツのインサート
                list.push(DatabaseUtil.createInsertQuery('contetbl', [
                    { col: 'owner', val: user.seq },
                    { col: 'id', val: ruleProps.id },
                    { col: 'name', val: ruleProps.name },
                    { col: 'outline', val: ruleProps.outline },
                    { col: 'refer_auth', val: ruleProps.referAuth },
                    { col: 'regist_auth', val: ruleProps.registAuth },
                    { col: 'search_limit', val: ruleProps.searchLimit },
                    { col: 'regist_limit', val: ruleProps.registLimit },
                    { col: 'fix_auth', val: ruleProps.fixAuth },
                    { col: 'view_creator', val: ruleProps.viewCreator },
                    { col: 'createdy', val: `datetime('now', 'localtime')`, isQuat: false },
                    { col: 'updatedy', val: `datetime('now', 'localtime')`, isQuat: false },
                ]));
                // 新規登録時のフィールドのインサート
                fieldList.forEach((field, i) => {
                    list.push(DatabaseUtil.createInsertQuery('fieldtbl', [
                        { col: 'conteseq', val: contentsSeq + 1 },
                        { col: 'field_no', val: i },
                        { col: 'sort_no', val: i },
                        { col: 'name', val: field.name },
                        { col: 'keyflg', val: field.keyflg },
                        { col: 'required', val: field.required },
                        { col: 'cont_unique', val: field.contUnique },
                        { col: 'outline', val: field.outline },
                        { col: 'input_type', val: field.inputType },
                        { col: 'list', val: field.list },
                        { col: 'width', val: field.width },
                    ]));
                });
                DatabaseUtil.sendQueryRequestToAPI('update', list.join(';')).then(() => {
                    window.location.reload();
                });
            })
        } else {
            const list: string[] = [];
            // 更新時のコンテンツのアップデート
            list.push(DatabaseUtil.createUpdateQuery('contetbl', [
                { col: 'id', val: ruleProps.id },
                { col: 'name', val: ruleProps.name },
                { col: 'outline', val: ruleProps.outline },
                { col: 'refer_auth', val: ruleProps.referAuth },
                { col: 'regist_auth', val: ruleProps.registAuth },
                { col: 'search_limit', val: ruleProps.searchLimit },
            ], `seq = ${props.masterConteSeq}`));

            fieldList.forEach((field, i) => {
                let nextFieldNo = maxFiledNo + 1;
                if (field.fieldNo === -1) {
                    // 更新時のコンテンツのインサート（新たに追加したフィールド）
                    list.push(DatabaseUtil.createInsertQuery('fieldtbl', [
                        { col: 'conteseq', val: props.masterConteSeq },
                        { col: 'field_no', val: nextFieldNo },
                        { col: 'sort_no', val: i },
                        { col: 'name', val: field.name },
                        { col: 'keyflg', val: field.keyflg },
                        { col: 'required', val: field.required },
                        { col: 'cont_unique', val: field.contUnique },
                        { col: 'outline', val: field.outline },
                        { col: 'input_type', val: field.inputType },
                        { col: 'list', val: field.list },
                        { col: 'width', val: field.width },
                    ]));
                    nextFieldNo++;
                } else {
                    // 更新時のコンテンツのアップデート（既存のフィールド）
                    list.push(DatabaseUtil.createUpdateQuery('fieldtbl', [
                        { col: 'sort_no', val: i },
                        { col: 'name', val: field.name },
                        { col: 'keyflg', val: field.keyflg },
                        { col: 'required', val: field.required },
                        { col: 'cont_unique', val: field.contUnique },
                        { col: 'outline', val: field.outline },
                        { col: 'input_type', val: field.inputType },
                        { col: 'list', val: field.list },
                        { col: 'width', val: field.width },
                    ], `conteseq = ${props.masterConteSeq} and field_no = ${field.fieldNo}`));

                }
            });
            if (removeList.length > 0) {
                list.push(`DELETE FROM fieldtbl where conteseq = ${props.masterConteSeq} and field_no in(${removeList.join(',')})`);
                list.push(`DELETE FROM rcvaltbl where conteseq = ${props.masterConteSeq} and field_no in(${removeList.join(',')})`);
            }
            DatabaseUtil.sendQueryRequestToAPI('update', list.join(';')).then(() => {
                window.location.reload();
            });
        }
    }

    return (
        <_Wrap>
            <_Button
                isEnable={true}
                onClick={() => {
                    // store.mode = 'entrance';
                    store.transition.backFrame();
                    setStore({ ...store });
                }}
            >戻る</_Button>
            <_MessageFrame><_Message>{'aa'}</_Message></_MessageFrame>
            <_Switch
                isFocus={isRule}
                onClick={() => {
                    if (!isRule) setRule(true);
                }}
            >ルール</_Switch>
            <_Switch
                isFocus={!isRule}
                onClick={() => {
                    if (isRule) setRule(false);
                }}
            >項目</_Switch>
            <_Frame>
                {isRule ? <RuleFrame ruleProps={ruleProps} setRuleProps={setRuleProps} /> :
                    <FieldFrame
                        fieldList={fieldList}
                        setFieldList={setFieldList}
                        openDetailDialog={openDetailDialog}
                        focusIndex={focusIndex}
                        setFocusIndex={setFocusIndex}
                        removeList={removeList}
                        setRemoveList={setRemoveList}
                    />
                }
            </_Frame>
            <_Button
                isEnable={isInputOK()}
                onClick={register}
            >{!isUpdate ? '登録' : '更新'}</_Button>
            {!isDispDialog ? <></> : <FieldDetailDialog
                index={focusIndex}
                fieldProps={fieldList[focusIndex]}
                apply={(fieldCache: RegulationUtil.FieldProps) => {
                    fieldList[focusIndex] = fieldCache;
                    setFieldList(fieldList.slice())
                }}
                close={() => { setDispDialog(false) }}
            />}
        </_Wrap>
    );
}

export default Regulation;

const findNextConteSeq = async () => {
    const response = await DatabaseUtil.sendQueryRequestToAPI('select', `SELECT seq FROM SQLITE_SEQUENCE where name = 'contetbl'`);
    const results = await response.json();
    return results[0].seq as number;
};


const _Wrap = styled.div`
    display: inline-block;
    width: 100%;
    max-width: 960px;
    height: 100%;
    background-color: #f3f3f328;
    text-align: center;
`;

const _Frame = styled.div`
    display: inline-block;
    width: calc(100% - 10px);
    height: calc(100% - 200px);
    background-color: #728f78;
    text-align: left;
    margin: 5px 0 0 0;
    overflow-y: auto;
    box-sizing: border-box;
    /* border: solid 1px #333; */
    border-radius: 8px;
    
    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #1959A8;
    }
    &::-webkit-scrollbar-track {
        border-radius: 5px;
        box-shadow: 0 0 4px #aaa inset;
    }
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
