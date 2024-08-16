// Functions to extract match details from PGN
export const extractMatchDetails = (pgn) => {

    const timeControlDict = {
        
        "120":"Bullet",
        "60": "Bullet",
        "30": "Ultra Bullet",
        "15":"Hyper Bullet",
        "180": "Blitz",
        "300":"Blitz",
        "900": "Rapid",
        "600":"Rapid",
        "1800":"Classical",
        "1500":"Classical"
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
    let event = ''
    if (timeControl) {
        event = `${getGameTypeName(timeControl)} Game`;
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
