export class TurnUtil {
    // Turn predicates
    static JUMPING = turn => turn.state == 'Jumping'
    static RESCUE = turn => turn.state == 'Rescue'
    static JAIL = turn => turn.state == 'Jail'
    static WHITE = turn => turn.player = 'White'
    static BLACK = turn => turn.player = 'Black'
    static NORMAL = turn => ! turn.state
}

// Convenience exports to make lines of code shorter
export const JUMPING = TurnUtil.JUMPING;
export const RESCUE = TurnUtil.RESCUE;
export const WHITE = TurnUtil.WHITE;
export const BLACK = TurnUtil.BLACK;
export const NORMAL = TurnUtil.NORMAL;
export const JAIL = TurnUtil.JAIL;
