import { GameState } from "@/interface/GameState";
import { cn } from "@/lib/utils";
import { MoveDown } from "lucide-react";

export default function GameField(props: { gameState: GameState, playerTurn: boolean, onColumnClick: (columnIndex: number) => void }) {
    const { gameState } = props;

    console.log(props.gameState.board)

    return <div className="flex flex-col gap-4 justify-center mt-4">
        {
            props.playerTurn && !gameState.isGameOver ? <div className="flex flex-row gap-2 justify-center">

                {Array.from({ length: 7 }).map((_, columnIndex) => {
                    return <MoveDown key={columnIndex} className="w-10 h-8 text-red-500" onClick={() => {
                        props.onColumnClick(columnIndex);
                    }} />
                })}

            </div> : <div className=" h-8"/>
        }
        <div className="flex flex-row gap-2 justify-center">
            {
                Array.from({ length: 7 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex flex-col gap-2">
                        {
                            Array.from({ length: 6 }).map((_, colIndex) => {
                                const entryState = gameState.board ? gameState.board[rowIndex][5-colIndex] : null;
                               return <div key={colIndex} className={cn("w-10 h-10 border rounded-full border-gray-300 flex items-center justify-center", entryState === 1 ? "bg-red-500" : entryState === 2 ? "bg-blue-500" : "bg-gray-200")}>
                                </div>
                            })
                        }
                    </div>
                ))
            }

        </div>
    </div>

}