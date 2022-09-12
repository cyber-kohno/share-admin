import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Styles from "../../design/styles";
import FormUtil from "../../utils/formUtil";
import RegulationUtil from "../../utils/regulationUtil";
import ValidateUtil from "../../utils/validateUtil";
import { GlobalContext } from "../entry/entry";

const FieldDetailDialog = (props: {
    isCreate: boolean;
    fieldProps: RegulationUtil.FieldProps;
    apply: (fieldCache: RegulationUtil.FieldProps) => void;
    close: () => void;
    existNames: string[];
}) => {
    // const { store, setStore } = useContext(GlobalContext);

    const [fieldCache, setFieldCache] = useState<RegulationUtil.FieldProps>({ ...props.fieldProps });
    // const [validate, setValidate] = useState<RegulationUtil.ValidateProps>({
    //     isRequied: false,
    //     isEisu: false
    // });
    const [direct, setDirect] = useState('');
    const [isRequired, setRequired] = useState(false);
    const [isEisu, setEisu] = useState(false);
    const [useLenLimit, setUseLenLimit] = useState(false);
    const [useNumLimit, setUseNumLimit] = useState(false);
    const [lenMin, setLenMin] = useState(0);
    const [lenMax, setLenMax] = useState(0);
    const [numMin, setNumMin] = useState(0);
    const [numMax, setNumMax] = useState(0);

    const update = () => { setFieldCache({ ...fieldCache }) };

    const [acceptFormName, setAcceptFormName] = useState(true);
    const [acceptFormOutline, setAcceptFormOutline] = useState(true);
    const [acceptFormLenMin, setAcceptFormLenMin] = useState(true);
    const [acceptFormLenMax, setAcceptFormLenMax] = useState(true);
    const [acceptFormNumMin, setAcceptFormNumMin] = useState(true);
    const [acceptFormNumMax, setAcceptFormNumMax] = useState(true);
    const [acceptFormChkmsg, setAcceptFormChkmsg] = useState(true);

    const acceptFormList = [
        acceptFormName,
        acceptFormOutline,
        acceptFormLenMin,
        acceptFormLenMax,
        acceptFormNumMin,
        acceptFormNumMax,
        acceptFormChkmsg
    ];

    useEffect(() => {


        if (fieldCache.inputType === 'combobox') {
            const listProps = JSON.parse(props.fieldProps.list) as RegulationUtil.ListProps;
            setDirect(listProps.direct);
        }
        const validateProps = JSON.parse(props.fieldProps.validate) as RegulationUtil.ValidateProps;
        setRequired(validateProps.required);
        setEisu(validateProps.eisu);
        setUseLenLimit(validateProps.useLenLimit);
        setUseNumLimit(validateProps.useNumLimit);
        setLenMin(validateProps.lenMin ?? 0);
        setLenMax(validateProps.lenMax ?? 0);
        setNumMin(validateProps.numMin ?? 0);
        setNumMax(validateProps.numMax ?? 0);
    }, []);

    const isInputOK = useMemo(() => {

        let ret = true;
        acceptFormList.some((acceptForm) => {
            if (!acceptForm) {
                ret = false;
                return true;
            }
        });

        return ret;
    }, acceptFormList);

    const applyAction = () => {
        if (fieldCache.inputType === 'combobox') {
            const list: RegulationUtil.ListProps = {
                type: 'direct',
                direct: direct
            }
            fieldCache.list = JSON.stringify(list);
        } else {
            fieldCache.list = '';
        }

        const validate: RegulationUtil.ValidateProps = {
            required: isRequired,
            eisu: isEisu,
            useLenLimit: useLenLimit,
            useNumLimit: useNumLimit
        };
        if (useLenLimit) {
            validate.lenMin = lenMin;
            validate.lenMax = lenMax;
        }
        if (useNumLimit) {
            validate.numMin = numMin;
            validate.numMax = numMax;
        }
        fieldCache.validate = JSON.stringify(validate);
        props.apply(fieldCache);
        props.close();
    };

    return (
        <_Wrap>
            <_Frame>
                <_Scroll>
                    <_Record>
                        <_Title>連番</_Title>
                        <_TextLabel>{fieldCache.fieldNo}</_TextLabel>
                    </_Record>
                    <FormUtil.InputItem
                        title="項目名"
                        formValue={fieldCache.name}
                        setFormValue={(value: string) => { fieldCache.name = value; update(); }}
                        formWidth={400}
                        inputType="text"
                        validators={[
                            ValidateUtil.getEmptyChecker(),
                            ValidateUtil.getLengthLimitChecker(20),
                            (str: string) => !props.existNames.includes(str) ? null : { type: 'relation', message: '既に存在する項目名と重複しています。' }
                        ]}
                        setAcceptForm={setAcceptFormName}
                    />
                    <FormUtil.InputItem
                        title="入力方式"
                        formValue={fieldCache.inputType}
                        setFormValue={(value: string) => { (fieldCache.inputType as string) = value; update(); }}
                        formWidth={200}
                        inputType="combobox"
                        listItems={RegulationUtil.FieldInputTypeItems.map(item => ({ value: item.key as string, message: item.message }))}
                        extChangeProc={() => {
                            if (!['number'].includes(fieldCache.inputType)) {
                                setUseNumLimit(false);
                            }
                            if (!(['text', 'sentence'] as RegulationUtil.FieldInputType[]).includes(fieldCache.inputType)) {
                                setUseLenLimit(false);
                                setEisu(false);
                            }
                        }}
                    />
                    <FormUtil.InputItem
                        title="キー"
                        formValue={fieldCache.keyflg}
                        isEnable={['text', 'number', 'combobox'].includes(fieldCache.inputType)}
                        setFormValue={(value: string) => { fieldCache.keyflg = value; update(); }}
                        inputType="checkbox"
                        checkMessage="データを特定するためのキー項目とする"
                        resetValue={''}
                    />
                    <FormUtil.InputItem
                        title="重複許可"
                        formValue={fieldCache.unqflg}
                        isEnable={['text', 'number', 'combobox'].includes(fieldCache.inputType)}
                        setFormValue={(value: string) => { fieldCache.unqflg = value; update(); }}
                        inputType="checkbox"
                        checkMessage="重複を認めない"
                    />
                    <FormUtil.InputItem
                        title="項目の概要"
                        formValue={fieldCache.outline}
                        setFormValue={(value: string) => { fieldCache.outline = value; update(); }}
                        inputType="sentence"
                        validators={[
                            ValidateUtil.getLengthLimitChecker(100)
                        ]}
                        setAcceptForm={setAcceptFormOutline}
                    />
                    <FormUtil.InputItem
                        title="選択肢"
                        isEnable={['combobox'].includes(fieldCache.inputType)}
                        formValue={direct}
                        setFormValue={(value: string) => { setDirect(value) }}
                        inputType="sentence"
                    />
                    {/* <_Record isEnable={props.fieldProps.inputType === 'combobox'}>
                        <_Title>選択肢</_Title>
                        <_TextForm type={'text'} value={fieldCache.list} onChange={(e) => {
                            fieldCache.list = e.target.value;
                            update();
                        }} />
                    </_Record> */}
                    <FormUtil.InputItem
                        title="チェックボックス説明"
                        formValue={fieldCache.chkmsg}
                        isEnable={(['check'] as RegulationUtil.FieldInputType[]).includes(fieldCache.inputType)}
                        setFormValue={(value: string) => { fieldCache.chkmsg = value; update(); }}
                        formWidth={400}
                        inputType="text"
                        validators={[
                            ValidateUtil.getEmptyChecker(),
                            ValidateUtil.getLengthLimitChecker(20)
                        ]}
                        setAcceptForm={setAcceptFormChkmsg}
                    />
                    <FormUtil.InputItem
                        title="必須"
                        formValue={isRequired ? '1' : ''}
                        isEnable={['text', 'number', 'combobox'].includes(fieldCache.inputType)}
                        setFormValue={(value: string) => {
                            setRequired(value === '1');
                        }}
                        inputType="checkbox"
                        checkMessage="必須項目とする"
                    />
                    <FormUtil.InputItem
                        title="半角英数"
                        formValue={isEisu ? '1' : ''}
                        isEnable={(['text', 'sentence'] as RegulationUtil.FieldInputType[]).includes(fieldCache.inputType)}
                        setFormValue={(value: string) => {
                            setEisu(value === '1');
                        }}
                        formWidth={100}
                        inputType="checkbox"
                        checkMessage="半角英数字のみ許容する"
                    />
                    <FormUtil.InputItem
                        title="文字数範囲制限"
                        formValue={useLenLimit ? '1' : ''}
                        isEnable={(['text', 'sentence'] as RegulationUtil.FieldInputType[]).includes(fieldCache.inputType)}
                        setFormValue={(value: string) => {
                            setUseLenLimit(value === '1');
                        }}
                        formWidth={100}
                        inputType="checkbox"
                        checkMessage="文字数の範囲制限を利用する"
                    />
                    <FormUtil.InputItem
                        title="最低文字数"
                        isEnable={useLenLimit}
                        formValue={useLenLimit ? String(lenMin) : ''}
                        formWidth={150}
                        setFormValue={(value: string) => { setLenMin(Number(value)) }}
                        inputType="number"
                        validators={[
                            (str: string) => Number(str) < lenMax ? null : { type: 'relation', message: '最大文字数より小さな値を設定して下さい。' }
                        ]}
                        setAcceptForm={setAcceptFormLenMin}
                        relationForms={[String(lenMax)]}
                        resetValue={String(1)}
                    />
                    <FormUtil.InputItem
                        title="最大文字数"
                        isEnable={useLenLimit}
                        formValue={useLenLimit ? String(lenMax) : ''}
                        formWidth={150}
                        setFormValue={(value: string) => { setLenMax(Number(value)) }}
                        inputType="number"
                        validators={[
                            (str: string) => Number(str) > lenMin ? null : { type: 'relation', message: '最低文字数より大きな値を設定して下さい。' }
                        ]}
                        setAcceptForm={setAcceptFormLenMax}
                        relationForms={[String(lenMin)]}
                        resetValue={String(1024)}
                    />
                    <FormUtil.InputItem
                        title="数値範囲制限"
                        formValue={useNumLimit ? '1' : ''}
                        isEnable={['number'].includes(fieldCache.inputType)}
                        setFormValue={(value: string) => {
                            setUseNumLimit(value === '1');
                        }}
                        formWidth={150}
                        inputType="checkbox"
                        checkMessage="数値の範囲制限を利用する"
                    />
                    <FormUtil.InputItem
                        title="最小値"
                        isEnable={useNumLimit}
                        formValue={useNumLimit ? String(numMin) : ''}
                        formWidth={150}
                        setFormValue={(value: string) => { setNumMin(Number(value)) }}
                        inputType="number"
                        validators={[
                            (str: string) => Number(str) < numMax ? null : { type: 'relation', message: '最大値より小さな値を設定して下さい。' }
                        ]}
                        setAcceptForm={setAcceptFormNumMin}
                        relationForms={[String(numMax)]}
                        resetValue={String(0)}
                    />
                    <FormUtil.InputItem
                        title="最大値"
                        isEnable={useNumLimit}
                        formValue={useNumLimit ? String(numMax) : ''}
                        formWidth={150}
                        setFormValue={(value: string) => { setNumMax(Number(value)) }}
                        inputType="number"
                        validators={[
                            (str: string) => Number(str) > numMin ? null : { type: 'relation', message: '最小値より大きな値を設定して下さい。' }
                        ]}
                        setAcceptForm={setAcceptFormNumMax}
                        relationForms={[String(numMin)]}
                        resetValue={String(99999999)}
                    />
                    <FormUtil.InputItem
                        title="初期値"
                        formValue={fieldCache.initial}
                        formWidth={100}
                        setFormValue={(value: string) => { fieldCache.initial = value; update(); }}
                        inputType="text"
                    />
                    <FormUtil.InputItem
                        title="フォーム幅"
                        formValue={String(fieldCache.formWidth)}
                        formWidth={100}
                        setFormValue={(value: string) => { fieldCache.formWidth = Number(value); update(); }}
                        inputType="number"
                    />
                    <FormUtil.InputItem
                        title="テーブル列幅"
                        formValue={String(fieldCache.colWidth)}
                        formWidth={100}
                        setFormValue={(value: string) => { fieldCache.colWidth = Number(value); update(); }}
                        inputType="number"
                    />
                </_Scroll>
                <_Button isEnable={isInputOK} onClick={applyAction}>{props.isCreate ? '作成' : '更新'}</_Button>
                <_Button isEnable={true} onClick={props.close}>キャンセル</_Button>
            </_Frame>
        </_Wrap>
    );
}

export default FieldDetailDialog;

const _Wrap = styled.div`
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: #0000008b;
    text-align: center;
`;

const _Frame = styled.div`
    display: inline-block;
    /* width: calc(100% - 30px); */
    max-width: 960px;
    height: calc(100% - 30px);
    /* margin: 4px 0 0 4px; */
    background-color: #b6ccbcdd;
    border-radius: 4px;
    margin: 15px 0 0 15px;
    /* border: 1px solid #ffffffc3; */
    text-align: left;
`;

const _Scroll = styled.div`
    display: inline-block;
    width: calc(100% - 10px);
    height: calc(100% - 45px);
    /* margin: 4px 0 0 4px; */
    background-color: #a7b8ac;
    border-radius: 4px;
    margin: 5px 0 0 0;
    /* border: 1px solid #ffffffc3; */
    text-align: center;
    overflow: auto;
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


const _Record = styled.div<{
    isEnable?: boolean;
}>`
    display: inline-block;
    ${props => (props.isEnable == undefined || props.isEnable) ? '' : Styles.CSS_BUTTON_DISABLE}
    width: 100%;
    min-height: 140px;
    background-color: #9b8f8f28;
    text-align: left;
    margin: 5px 0 0 0;
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

const _CheckDiv = styled.div<{
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    background-color: #ffd90028;
`;
const _CheckText = styled.span<{
}>`
    color: #330f00;
    /* background-color: #9b8f8f28; */
`;
const _CheckForm = styled.input<{
}>`
    /* width: 30px;
    height: 30px; */
    /* background-color: #e6424228; */
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

const _Error = styled.div<{
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    /* background-color: #ffd90028; */
    color: red;
`;