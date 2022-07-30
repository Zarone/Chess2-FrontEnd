enum ComputerType {
    HEURISTIC = "HEURISTIC",
    ALGORITHMIC = "ALGORITHMIC" 
}

export type computerType = ("actHeuristic" | "actAlgorithmic")

const computerTypes: {[key: string]: computerType} = {
    "HEURISTIC": "actHeuristic",
    "ALGORITHMIC": "actAlgorithmic"
}

function validateType(type: string): string{
    for (let key in computerTypes){
        if (key == type) return type; 
    }

    debugger
    throw new Error("Type validation failed")
}

function validateLevel(type: number){
    if (!isNaN(type)) return type;
    throw new Error("Level validation failed")
}

export interface EnemyComputerConstructorArgs {
    level: number, type: string
}

export class EnemyComputerSettings {
    level: number;
    type: string;
    act: computerType;
    constructor({level, type}: EnemyComputerConstructorArgs){
        this.level = validateLevel(level);
        this.type = validateType(type);
        this.act = computerTypes[this.type]
    }
}