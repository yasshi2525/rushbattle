export interface GameMainParameterObject extends g.GameMainParameterObject {
  [index: string]: unknown;
  sessionParameter: {
    mode?: string;
    totalTimeLimit?: number;
    difficulty?: number;
    randomSeed?: number;
  };
  isAtsumaru: boolean;
  random: g.RandomGenerator;
  firstJoinedPlayerId: string;
}

export interface RPGAtsumaruWindow {
  RPGAtsumaru?: unknown;
}
