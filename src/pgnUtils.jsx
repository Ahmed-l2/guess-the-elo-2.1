// Functions to extract match details from PGN
export const extractMatchDetails = (pgn) => {
    const event = pgn.match(/\[Event "(.*?)"(?: https?:\/\/\S*)?\]/)?.[1].split(' https://')[0].split('http://')[0] || null;

   
    const whiteElo = pgn.match(/\[WhiteElo "(\d+)"\]/)?.[1] || null;
    const blackElo = pgn.match(/\[BlackElo "(\d+)"\]/)?.[1] || null;
    const result = pgn.match(/\[Result "(.*?)"\]/)?.[1] || null;
    const opening = pgn.match(/\[Opening "(.*?)"\]/)?.[1] || null;
    const termination =pgn.match(/\[Termination "(.*?)"\]/)?.[1];

    return {
      event,
      whiteElo: whiteElo ? parseInt(whiteElo, 10) : null,
      blackElo: blackElo ? parseInt(blackElo, 10) : null,
      result,
      opening,
      termination
    };

    
  };
