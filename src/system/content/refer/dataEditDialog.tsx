import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Styles from "../../design/styles";
import FormUtil from "../../utils/formUtil";
import RegulationUtil from "../../utils/regulationUtil";
import ValidateUtil from "../../utils/validateUtil";

export type DataEditDialogProps = {
    fieldList: RegulationUtil.FieldProps[];
    initialValues: string[] | null;
    regist: (forms: string[]) => void;
    close: () => void;
};

const DataEditDialog = (props: DataEditDialogProps) => {
    // const { store, setStore } = useContext(GlobalContext);

    const [forms, setForms] = useState<string[]>([]);

    const [acceptList, setAcceptList] = useState<boolean[]>([]);

    useEffect(() => {
        if (props.initialValues == null) {
            setForms(props.fieldList.map(field => field.initial));
        } else {
            setForms(props.initialValues);
        }
        const acceptList = new Array<boolean>(props.fieldList.length).fill(true);
        setAcceptList(acceptList);
    }, []);

    const fieldJsxList = forms.map((form, i) => {
        const field = props.fieldList[i];
        const getFormJsx = () => {
            const update = () => { setForms(forms.slice()) };
            const setAcceptForm = (accept: boolean) => {
                acceptList[i] = accept;
                setAcceptList(acceptList.slice())
            }
            const validate = JSON.parse(field.validate) as RegulationUtil.ValidateProps;
            const validators: ValidateUtil.Validator[] = [];
            if (validate.required) {
                validators.push(ValidateUtil.getEmptyChecker());
            }
            if (validate.eisu) {
                validators.push(ValidateUtil.getHalfEisuChecker());
            }
            if (validate.useLenLimit) {
                const lenMin = validate.lenMin as number;
                const lenMax = validate.lenMax as number;
                validators.push(ValidateUtil.getLengthRangeChecker(lenMin, lenMax));
            }
            if (validate.useNumLimit) {
                const numMin = validate.numMin as number;
                const numMax = validate.numMax as number;
                validators.push(ValidateUtil.getValueRangeChecker(numMin, numMax));
            }
            switch (field.inputType) {
                case 'text': return (
                    // <_TextForm value={form} onChange={(e) => {
                    //     forms[i] = e.target.value;
                    //     setForms(forms.slice());
                    // }} />

                    <FormUtil.InputItem
                        title={field.name}
                        formValue={forms[i]}
                        setFormValue={(value: string) => { forms[i] = value; update(); }}
                        formWidth={field.formWidth}
                        inputType="text"
                        validators={validators.length === 0 ? undefined : validators}
                        setAcceptForm={setAcceptForm}
                    />
                );
                case 'number': return (
                    // <_NumberForm type={'number'} value={form} onChange={(e) => {
                    //     forms[i] = e.target.value;
                    //     setForms(forms.slice());
                    // }} />

                    <FormUtil.InputItem
                        title={field.name}
                        formValue={forms[i]}
                        setFormValue={(value: string) => { forms[i] = value; update(); }}
                        formWidth={field.formWidth}
                        inputType="number"
                        validators={validators.length === 0 ? undefined : validators}
                        setAcceptForm={setAcceptForm}
                    />
                );
                case 'combobox': return (
                    // <_Combobox value={form} onChange={(e) => {
                    //     forms[i] = e.target.value;
                    //     setForms(forms.slice());
                    // }} >{field.list.split(',').map((value, j) => {
                    //     return <option key={j} value={value}>{value}</option>;
                    // })}</_Combobox>

                    <FormUtil.InputItem
                        title={field.name}
                        formValue={forms[i]}
                        setFormValue={(value: string) => { forms[i] = value; update(); }}
                        formWidth={field.formWidth}
                        inputType="combobox"
                        listItems={
                            (JSON.parse(field.list) as RegulationUtil.ListProps).direct.split(',').map((value) => {
                                return { value, message: value };
                            })
                        }
                    />
                );
                case 'sentence': return (
                    // <_TextArea value={form} onChange={(e) => {
                    //     forms[i] = e.target.value;
                    //     setForms(forms.slice());
                    // }} />

                    <FormUtil.InputItem
                        title={field.name}
                        formValue={forms[i]}
                        setFormValue={(value: string) => { forms[i] = value; update(); }}
                        formWidth={field.formWidth}
                        inputType="sentence"
                        validators={validators.length === 0 ? undefined : validators}
                        setAcceptForm={setAcceptForm}
                    />
                );
                case 'check': return (

                    <FormUtil.InputItem
                        title={field.name}
                        formValue={forms[i]}
                        setFormValue={(value: string) => { forms[i] = value; update(); }}
                        inputType="checkbox"
                        checkMessage={field.chkmsg}
                    />
                );
                case 'image': return (<>
                    <FormUtil.InputItem
                        title={field.name}
                        formValue={forms[i]}
                        setFormValue={(value: string) => { forms[i] = value; update(); }}
                        inputType="text"
                        validators={validators.length === 0 ? undefined : validators}
                        setAcceptForm={setAcceptForm}
                        extend={<_Image src={form} />}
                    />
                </>);
            }
        }
        const inputType = RegulationUtil.FieldInputTypeItems.find(item => item.key === field.inputType);
        // const imputTypeName = inputType == undefined ? '' : inputType.message;
        return (
            <div key={i}>
                {/* <_Text><_Name>{field.sortNo + 1}.{field.name}</_Name> [{imputTypeName}]</_Text> */}
                {getFormJsx()}
            </div>
        );
    }, []);

    const isInputAllOK = () => {
        return acceptList.find(accept => !accept) == undefined;
    }
    return (
        <_Wrap>
            <_Frame>
                <_Scroll>
                    {fieldJsxList}
                </_Scroll>
                <_Button isEnable={isInputAllOK()} onClick={() => {
                    props.regist(forms);
                    props.close();
                }}>更新</_Button>
                <_Button isEnable={true} onClick={props.close}>キャンセル</_Button>
            </_Frame>
        </_Wrap>
    );
}

export default DataEditDialog;

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
    position: relative;
    width: calc(100% - 20px);
    max-width: 960px;
    height: calc(100% - 20px);
    /* margin: 4px 0 0 4px; */
    background-color: #b6ccbcdd;
    border-radius: 4px;
    margin: 10px 0 0 0;
    /* border: 1px solid #ffffffc3; */
    text-align: center;
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

const _Record = styled.div`
    display: inline-block;
    width: 100%;
    /* min-height: 140px; */
    background-color: #8f9b93;
    text-align: left;
    margin: 5px 0 0 0;
    padding: 0 0 5px 0;
`;

const _Text = styled.div<{
}>`
    display: inline-block;
    width: 100%;
    height: 40px;
    font-size: 24px;
    padding: 0 0 0 10px;
    box-sizing: border-box;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    color: #ffeaa4ae;
`;
const _Name = styled.span<{
}>`
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
const _Image = styled.img<{
}>`
    display: inline-block;
    width: 200px;
    height: 200px;
    margin: 5px 0 0 10px;
`;

const _NumberForm = styled.input<{
}>`
    display: inline-block;
    width: 200px;
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