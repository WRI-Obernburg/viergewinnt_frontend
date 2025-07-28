import { GameState } from "@/interface/GameState";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useWebSocket from "react-use-websocket";
import GameField from "./GameField";
import { Button } from "@/components/ui/button"

export default function Game(props: {sessionID: string}) {
   
    const [isSessionIDValid, setIsSessionIDValid] = useState(true);
    const [gameState, setGameState] = useState<GameState | null>(null)

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket("http://localhost:3000/play?sessionID="+props.sessionID, {
        onOpen: () => console.log('opened'),
        onMessage: (message) => {
            console.log('message received', message);
            const data = JSON.parse(message.data) as GameState;
            setGameState(data);
        },
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => {
            if(closeEvent.code === 4422) {
                setIsSessionIDValid(false);
                return false; // Don't reconnect if the session is not found
            }

            return true;
        },
    });

    function handleColumnClick(columnIndex: number) {
        console.log('Column clicked:', columnIndex);
        if(gameState && gameState.isHumanTurn && !gameState.isGameOver) {
            sendJsonMessage({
                type: "placeChip",
                slot: columnIndex,
            });
        }
    }


    

    if(!isSessionIDValid) {
        return <div className="flex flex-col gap-4 justify-center mt-4">
            <div className="text-center font-bold">Scanne den QR-Code um ein Spiel zu starten</div>
            <div className="text-red-500 text-center font-bold">
                Spiel ID ist abgelaufen
            </div>
        </div>
    }

    if(!gameState) {
        return <div className="flex flex-col gap-4 justify-center mt-4">
            <div className="text-center">Warte auf Spielstatus...</div>
        </div>
    }

    if(!gameState.isGameRunning && !gameState.isGameOver) {
        return <div className="flex flex-col gap-4 justify-center self-center w-fit mt-4">
            <div className="text-center text-2xl font-bold">Spiel ist noch nicht gestartet</div>
            <StartGame onGameStart={() => {
                sendJsonMessage({
                    type: "startGame",
                });
            }} />
        </div>
    }

    return <div className="flex flex-col gap-4 justify-center mt-4">
        <CurrentAction gameState={gameState} />
        <GameField gameState={gameState} onColumnClick={handleColumnClick} playerTurn={gameState.isHumanTurn && !gameState.isRobotInAction}/>

    </div>

    }

function CurrentAction(props: {gameState: GameState}) {
       

        if(props.gameState.isGameOver && props.gameState.winner === 2) {
            return <div className="text-center text-2xl font-bold">Der Roboter hat gewonnen!</div>   
        }

        if(props.gameState.isGameOver && props.gameState.winner === 1) {
            return <div className="text-center text-2xl font-bold">Du hast gewonnen!</div>
        }

        if(props.gameState.isRobotInAction && props.gameState.isHumanTurn) {
            return <div className="text-center text-2xl font-bold">Der Roboter setzt deinen Chip...</div>
        }

        if(!props.gameState.isHumanTurn) {
            return <div className="text-center text-2xl font-bold">Der Roboter ist am Zug...</div>
        }

        if(props.gameState.isHumanTurn) {
            return <div className="text-center text-2xl font-bold">Du bist am Zug!</div>
        }



    }


    function StartGame(props: {onGameStart: () => void}) {
       

        return <Button onClick={props.onGameStart} className="bg-green-600 text-white px-4 py-2 w-fit self-center rounded">
            Spiel starten
        </Button>

    }