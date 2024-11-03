import "./BetBoard.css"

export enum CellType {
    NUMBER,
    FIRST_ROW,
    SECOND_ROW,
    THIRD_ROW,
    FIRST_12,
    SECOND_12,
    THIRD_12,
    ONE_TO_EIGHTEEN,
    NINETEEN_TO_THIRTYSIX,
    EVEN,
    ODD,
    REDS,
    BLACKS,
    SPLIT,
    STREET,
    CORNER,
    NONE
}

// NO SE USA
export function BetBoard() {
    return (
        <>
            <table className="bet-board-grid">
                <tbody>
                    <tr className="h-wide">
                        <td className="v-wide number" rowSpan={5}></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide h-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                        <td className="v-narrow"></td>
                        <td className="v-wide number"></td>
                    </tr>
                    <tr className="h-narrow">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className="h-wide">
                    <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className="h-narrow">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className="h-wide">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className="h-narrow borrar todos">
                        <td rowSpan={2} className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                        <td className="v-narrow"></td>
                    </tr>
                    <tr className="h-wide">
                    <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className="h-narrow">
                    <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className="h-wide">
                    <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <img src="./src/assets/roulette/BetBoard.png" className="bet-board-image" />
        </>
    )
// NO SE USA
}