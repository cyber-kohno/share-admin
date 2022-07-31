import { useContext, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../../design/styles";
import DatabaseUtil from "../../utils/databaseUtil";
import RegulationUtil from "../../utils/regulationUtil";
import { GlobalContext } from "../entry/entry";
import FieldDetailDialog from "./fieldDetailDialog";
import FieldFrame from "./fieldFrame";
import RuleFrame from "./ruleFrame";

const Regulation = () => {
    const { store, setStore } = useContext(GlobalContext);

    const [isRule, setRule] = useState(true);
    const [isDispDialog, setDispDialog] = useState(false);
    const [focusIndex, setFocusIndex] = useState(0);
    const [ruleProps, setRuleProps] = useState<RegulationUtil.RuleProps>({
        id: '',
        name: '',
        referAuth: 'no-login',
        editAuth: 'login',
        outline: '',
        searchLimit: 'free',
        addCount: 'unlimited',
        fixAuth: 'creator-only',
        viewCreator: 'always',
        available: 'close',
        openFrom: '',
        openTo: ''
    });

    const [fieldList, setFieldList] = useState<RegulationUtil.FieldProps[]>([RegulationUtil.createInitialField(0)]);

    const isInputOK = () => {
        return true;
    }

    const openDetailDialog = () => {
        setDispDialog(true);
    }

    const register = () => {
        findConteSeq().then((contentsSeq) => {
            console.log(contentsSeq);
            const list: string[] = [];
            list.push(`INSERT INTO contetbl(
                owner, id, name, outline, refer_auth, edit_auth,
                search_limit, add_count, fix_auth, view_creator,
                createdy, updatedy
            ) VALUES(
                ${store.user?.seq}, '${ruleProps.id}', '${ruleProps.name}', '${ruleProps.outline}',
                '${ruleProps.referAuth}', '${ruleProps.editAuth}', '${ruleProps.searchLimit}',
                '${ruleProps.addCount}', '${ruleProps.fixAuth}', '${ruleProps.viewCreator}',
                datetime('now', 'localtime'), datetime('now', 'localtime')
            )`);
            fieldList.forEach((field, i) => {
                list.push(`INSERT INTO fieldtbl(
                        contents, no, name, outline, cont_unique, input_type, list, width
                    ) VALUES(
                        ${contentsSeq + 1}, ${i}, '${field.name}', '${field.outline}',
                        '${field.isUnique ? '1' : ''}', '${field.inputType}', '${field.list}', ${field.width}
                    )
                `);
            });
            DatabaseUtil.sendQueryRequestToAPI('update', list.join(';')).then(() => {
                window.location.reload();
            });
        })
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
                    />
                }
            </_Frame>
            <_Button
                isEnable={isInputOK()}
                onClick={register}
            >{true ? '登録' : '更新'}</_Button>
            {!isDispDialog ? <></> : <FieldDetailDialog
                index={focusIndex}
                fieldProps={fieldList[focusIndex]}
                update={() => { setFieldList(fieldList.slice()) }}
                close={() => { setDispDialog(false) }}
            />}
        </_Wrap>
    );
}

export default Regulation;

const findConteSeq = async () => {
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
