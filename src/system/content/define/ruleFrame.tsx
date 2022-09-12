import { useContext, useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../../design/styles";
import DatabaseUtil from "../../utils/databaseUtil";
import FormUtil from "../../utils/formUtil";
import RegulationUtil from "../../utils/regulationUtil";
import ValidateUtil from "../../utils/validateUtil";
import { GlobalContext } from "../entry/entry";
import ListManager from "./listManager";

const RuleFrame = (props: {
    ruleProps: RegulationUtil.RuleProps;
    setRuleProps: (ruleProps: RegulationUtil.RuleProps) => void;
}) => {

    const rule = props.ruleProps;
    const update = () => props.setRuleProps({ ...rule });

    const [acceptFormId, setAcceptFormId] = useState(true);

    const [joinUserList, setJoinUserList] = useState<string[]>([]);

    const [userSetList, setUserSetList] = useState<ListManager.TargetSet[]>([]);

    useEffect(() => {
        findUserSetList().then(list => {
            setUserSetList(list);
        });
    }, []);

    useEffect(() => {
        rule.referUsers = joinUserList.join(',');
    }, [joinUserList]);

    return (
        <_Wrap>
            <FormUtil.InputItem
                title="コンテンツ識別ID"
                formValue={rule.id}
                setFormValue={(value: string) => { rule.id = value; update(); }}
                formWidth={300}
                inputType="text"
                validators={[
                    ValidateUtil.getEmptyChecker(),
                    ValidateUtil.getLengthLimitChecker(20)
                ]}
            // setAcceptForm={setAcceptFormName}
            />
            <FormUtil.InputItem
                title="コンテンツ名"
                formValue={rule.name}
                setFormValue={(value: string) => { rule.name = value; update(); }}
                // formWidth={400}
                inputType="text"
                validators={[
                    ValidateUtil.getEmptyChecker(),
                    ValidateUtil.getLengthLimitChecker(30)
                ]}
            // setAcceptForm={setAcceptFormName}
            />
            <FormUtil.InputItem
                title="コンテンツの概要"
                formValue={rule.outline}
                setFormValue={(value: string) => { rule.outline = value; update(); }}
                inputType="sentence"
                validators={[
                    ValidateUtil.getLengthLimitChecker(100)
                ]}
            // setAcceptForm={setAcceptFormOutline}
            />
            <_Record>
                <_Title>参照制限</_Title>
                <_Combobox value={props.ruleProps.referAuth} onChange={(e) => {
                    props.ruleProps.referAuth = e.target.value as RegulationUtil.ReferAuth;
                    update();
                }} >
                    {RegulationUtil.ReferAuthItems.map((item, i) => (
                        <option key={i} value={item.key}>{item.message}</option>
                    ))}
                </_Combobox>
            </_Record>
            <_Record isEnable={props.ruleProps.referAuth === 'user-limit'}>
                <_Title>参照許可ユーザリスト</_Title>
                <ListManager.Component
                    userList={joinUserList}
                    setUserList={setJoinUserList}
                    targetList={userSetList}
                />
            </_Record>
            <_Record isEnable={props.ruleProps.referAuth === 'group-limit'}>
                <_Title>参照許可グループリスト</_Title>
            </_Record>
            <_Record>
                <_Title>編集制限</_Title>
                <_Combobox value={props.ruleProps.registAuth} onChange={(e) => {
                    props.ruleProps.registAuth = e.target.value as RegulationUtil.EditAuth;
                    update();
                }} >
                    {RegulationUtil.EditAuthItems.map((item, i) => (
                        <option key={i} value={item.key}>{item.message}</option>
                    ))}
                </_Combobox>
            </_Record>
            <_Record isEnable={props.ruleProps.registAuth === 'user-limit'}>
                <_Title>編集許可ユーザリスト</_Title>
            </_Record>
            <_Record isEnable={props.ruleProps.registAuth === 'group-limit'}>
                <_Title>編集許可グループリスト</_Title>
            </_Record>
            <_Record>
                <_Title>検索制限</_Title>
                <_Combobox value={props.ruleProps.searchLimit} onChange={(e) => {
                    props.ruleProps.searchLimit = e.target.value as RegulationUtil.SearchLimit;
                    update();
                }} >
                    {RegulationUtil.SearchLimitItems.map((item, i) => (
                        <option key={i} value={item.key}>{item.message}</option>
                    ))}
                </_Combobox>
            </_Record>
            <_Record>
                <_Title>入力数制限</_Title>
                <_Combobox value={props.ruleProps.registLimit} onChange={(e) => {
                    props.ruleProps.registLimit = e.target.value as RegulationUtil.RegistLimit;
                    update();
                }} >
                    {RegulationUtil.AddCountItems.map((item, i) => (
                        <option key={i} value={item.key}>{item.message}</option>
                    ))}
                </_Combobox>
            </_Record>
            <_Record>
                <_Title>データ修正許可ユーザ</_Title>
                <_Combobox value={props.ruleProps.fixAuth} onChange={(e) => {
                    props.ruleProps.fixAuth = e.target.value as RegulationUtil.FixAuth;
                    update();
                }} >
                    {RegulationUtil.FixAuthItems.map((item, i) => (
                        <option key={i} value={item.key}>{item.message}</option>
                    ))}
                </_Combobox>
            </_Record>
            <_Record>
                <_Title>入力ユーザのID公開</_Title>
                <_Combobox value={props.ruleProps.viewCreator} onChange={(e) => {
                    props.ruleProps.viewCreator = e.target.value as RegulationUtil.ViewCreator;
                    update();
                }} >
                    {RegulationUtil.ViewCreatorItems.map((item, i) => (
                        <option key={i} value={item.key}>{item.message}</option>
                    ))}
                </_Combobox>
            </_Record>
            <_Record>
                <_Title>利用可否（公開するか）</_Title>
                <_Combobox value={props.ruleProps.available} onChange={(e) => {
                    props.ruleProps.available = e.target.value as RegulationUtil.Available;
                    update();
                }} >
                    {RegulationUtil.AvailableItems.map((item, i) => (
                        <option key={i} value={item.key}>{item.message}</option>
                    ))}
                </_Combobox>
            </_Record>
            <_Record isEnable={props.ruleProps.available === 'range'}>
                <_Title>利用可能期間</_Title>
            </_Record>
        </_Wrap>
    );
}

export default RuleFrame;

const findUserSetList = async () => {
    const response = await DatabaseUtil.sendQueryRequestToAPI('select', `SELECT seq, id FROM user_tbl`);
    const results = await response.json();
    return (results as ListManager.TargetSet[]);
};


const _Wrap = styled.div`
    display: inline-block;
    width: 100%;
    height: 100%;
    text-align: left;
`;

const _Record = styled.div<{
    isEnable?: boolean;
}>`
    display: inline-block;
    ${props => (props.isEnable == undefined || props.isEnable) ? '' : Styles.CSS_BUTTON_DISABLE}
    width: 100%;
    min-height: 140px;
    padding: 0 0 4px 0;
    background-color: #9b8f8f28;
    text-align: left;
    margin: 5px 0 0 0;
    border-top: solid 1px #e7e7e73e;
    border-bottom: solid 1px #e7e7e73e;
`;

const _Title = styled.div<{
}>`
    display: inline-block;
    width: 100%;
    height: 40px;
    font-size: 24px;
    padding: 0 0 0 10px;
    box-sizing: border-box;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    color: #330f00;
`;

const _TextForm = styled.input<{
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #330f00;
`;

const _TextArea = styled.textarea<{
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 60px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #330f00;
    resize: none;
`;

const _TextLabel = styled.div<{
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #3529a0;
    background-color: #ffffff78;
    border: solid 1px #000;
`;

const _Combobox = styled.select<{
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #3529a0;
    background-color: #ffffff78;
    border: solid 1px #000;
`;