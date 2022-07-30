import Entrance from "../../content/entrance/entrance";

class TransitionManager {

    curIndex: number;
    history: JSX.Element[];

    constructor() {
        this.curIndex = 0;
        this.history = [<Entrance />];
    }

    public getFrameJsx() {
        return this.history[this.curIndex];
    }

    public setNextFrame(frame: JSX.Element) {
        //終端
        const terminus = this.history.length - 1;
        const surplus = terminus - this.curIndex;
        if (this.curIndex < terminus) {
            this.history.splice(this.curIndex + 1, surplus);
        }
        this.history.push(frame);
        this.curIndex++;
    }

    public backFrame() {
        if (this.curIndex > 0) {
            this.curIndex--;
        }
    }

    public getCurIndex() { return this.curIndex; }
}

export default TransitionManager;