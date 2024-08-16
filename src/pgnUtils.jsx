// Functions to extract match details from PGN
export const extractMatchDetails = (pgn) => {

    const timeControlDict = {
        "900": "Rapid",
        "60": "Bullet",
        "180": "Blitz"
    };

    function getGameTypeName(timeControl) {
        return timeControlDict[timeControl] || timeControl;
    }


    const whiteElo = pgn.match(/\[WhiteElo "(\d+)"\]/)?.[1] || null;
    const blackElo = pgn.match(/\[BlackElo "(\d+)"\]/)?.[1] || null;
    const result = pgn.match(/\[Result "(.*?)"\]/)?.[1] || null;

    const openingMatch = pgn.match(/\[ECOUrl\s+".*\/([^"\d\.]+)/);
    const opening = openingMatch ? openingMatch[1].replace(/-/g, ' ') : null;

    const timeControlMatch = pgn.match(/\[TimeControl\s*"\s*([^+"]+)/);
    const timeControl = timeControlMatch ? timeControlMatch[1].trim() : null;
    if (timeControl) {
        const event = getGameTypeName(timeControl);
        console.log(event);
    }

    const terminationMatch = pgn.match(/\[Termination\s+"[^"]*(won.*)"\]/);
    const termination = terminationMatch ? terminationMatch[1].replace(/^.*?won\s/, 'won ') : null;

    return {
        event,
        whiteElo: whiteElo ? parseInt(whiteElo, 10) : null,
        blackElo: blackElo ? parseInt(blackElo, 10) : null,
        result,
        opening,
        timeControl,
        termination
    };
};
