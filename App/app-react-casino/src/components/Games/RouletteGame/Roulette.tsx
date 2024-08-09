import "./Roulette.css"

let singleShift: number = 360 / 37; // 9,729...
let currentRotation: number = 0;
let currentNumber: number = 0;

let rouletteWheelNumbers: number[] = [ 0, 32, 15, 19,  4, 21,  2, 25, 17, 34,
                                       6, 27, 13, 36, 11, 30,  8, 23, 10,  5,
                                      24, 16, 33,  1, 20, 14, 31,  9, 22, 18,
                                      29,  7, 28, 12, 35,  3, 26];


function randInt(n: number, m: number | null = null) {
    if (m != null) {
        return Math.floor(Math.random() * (m - n)) + n;
    } else {
        return Math.floor(Math.random() * n);
    }
}

export function Rotar() {
    Math.random()
    let winningNumber: number = randInt(37);
    let rotations: number = randInt(5, 8) * 360;
    console.log("Indice: " + winningNumber);
    console.log("Ganador: " + rouletteWheelNumbers[winningNumber]);
    const rouletteSpinningPart: HTMLElement | null = document.getElementById("spinning-part");
    if (rouletteSpinningPart != null) {
        currentRotation -= rotations + singleShift*(winningNumber - currentNumber);
        rouletteSpinningPart.style.transform = "rotate(" + currentRotation + "deg)";
        currentNumber = winningNumber
    }
}

export function Roulette() {
    return(
        <>
            <div className="roulette">
                <img src="./src/assets/roulette/RouletteFixedPart.png" className="fixed-part" id="fixed-part" />
                <img src="./src/assets/roulette/RouletteSpinningPart.png" className="spinning-part" id="spinning-part" />
            </div>
        </>

    );
};