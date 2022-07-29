import { createContext, useContext } from "react";
import useMedia from "use-media";
import SystemUtil from "../../utils/systemUtil";
import AccountManage from "../account/accountManage";
import DefineManager from "../define/defineManage";
import Entrance from "../entrance/entrance";
import DataViewerRoot from "../refer/dataViewerRoot";
import SeachContents from "../seach/seachContents";
import { GlobalContext } from "./entry";


export const MediaQueryContext = createContext<SystemUtil.MediaQuery>('mobile');

const ManageFrame = () => {

    const { store, setStore } = useContext(GlobalContext);

    let mediaQuery: SystemUtil.MediaQuery = 'pc';
    if (useMedia(SystemUtil.TABLET_RANGE)) mediaQuery = 'tablet';
    if (useMedia(SystemUtil.MOBILE_RANGE)) mediaQuery = 'mobile';


    const getContentsJsx = () => {
        switch (store.mode) {
            case 'entrance': return <Entrance />;
            case 'regulation': return <DefineManager />;
            case 'refer': return <DataViewerRoot />;
            case 'search': return <SeachContents />;
            case 'account': return <AccountManage />;
        }
    };

    return (
        <MediaQueryContext.Provider value={mediaQuery}>
            {getContentsJsx()}
        </MediaQueryContext.Provider>
    );
}

export default ManageFrame;