/*
    DOM Interfaces
 */
interface Event {
    touches: any[];
}

interface FrameRequestCallback {
    (time: Date): void;
}

/*
    Entity Interfaces
 */
interface IFrame {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IEntity {
    frame: IFrame;
    ID: number;
    fillStyle: string;

    draw(ctx: any): void;
    update(): void;
}
