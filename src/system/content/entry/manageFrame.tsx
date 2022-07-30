import { createContext, useContext } from "react";
import useMedia from "use-media";
import SystemUtil from "../../utils/systemUtil";
import { GlobalContext } from "./entry";


export const MediaQueryContext = createContext<SystemUtil.MediaQuery>('mobile');

const ManageFrame = () => {

    const { store, setStore } = useContext(GlobalContext);

    let mediaQuery: SystemUtil.MediaQuery = 'pc';
    if (useMedia(SystemUtil.TABLET_RANGE)) mediaQuery = 'tablet';
    if (useMedia(SystemUtil.MOBILE_RANGE)) mediaQuery = 'mobile';

    return (
        <MediaQueryContext.Provider value={mediaQuery}>
            {store.transition.getFrameJsx()}
        </MediaQueryContext.Provider>
    );
}

export default ManageFrame;