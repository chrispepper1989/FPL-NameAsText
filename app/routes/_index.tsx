import { useState, useEffect, useRef } from 'react';
import { requestOptions } from './headers';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { LoaderFunction } from '@vercel/remix';
import { BootstrapData, TeamPicks, LoaderData } from './types';


/*Loader function AKA "the backend" */
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const teamId = url.searchParams.get('teamId');

  // get the  bulk of the API data from the generic "bootstrap" api
  // this has all the player names GW information, its a huge payload!
  const bootstrapResponse = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', requestOptions);
  const bootstrapData: BootstrapData = await bootstrapResponse.json();

  //figure out current gameweek to use in the next fetch
  let currentWeek = 1;
  bootstrapData.events.forEach((element) => {
    if (element.finished) {
      currentWeek = element.id;
    }
  });

  // OK get the actual player names now
  let playerNames = '';
  if (teamId && currentWeek) {
    const cleanTeamId = teamId.replace(/[^0-9]/g, '');
    // grab the team 
    const teamPicksResponse = await fetch(
      `https://fantasy.premierleague.com/api/entry/${cleanTeamId}/event/${currentWeek}/picks/`,
      requestOptions
    );
    
    if(!teamPicksResponse.ok)
    {
      return {success:false}
    }
    const teamPicks: TeamPicks = await teamPicksResponse.json();

    console.log(teamPicks)
    const playersByType: { [key: number]: string[] } = {};

    // group all the players into rows, and tweak their names, ready to create the text output
    teamPicks.picks.forEach((pick) => {
      const player = bootstrapData.elements.find((p) => p.id === pick.element);
      if (player) {
        if (!playersByType[player.element_type]) {
          playersByType[player.element_type] = [];
        }
        let name = player.web_name;
        if(pick.is_captain)
        {
          name+="(C)";
        }
        if(pick.is_vice_captain)
        {
          name+="(V)";
        }
     
        playersByType[player.element_type].push(name);
      }
    });
     // create the text output!
    Object.keys(playersByType).forEach((type) => {
      playerNames += `| ${playersByType[parseInt(type)].join(', ')} |\n`;
    });
  }

  return {
    gameweek: currentWeek,
    playerNames: playerNames,
    success:true,
  };
};

/* the index page, AKA "the front end"*/
export default function Index() {
  const { gameweek, playerNames, success } = useLoaderData<LoaderData>();
  const [teamId, setTeamId] = useState<string>('');
   const [searchParams, setSearchParams] = useSearchParams();

   
  //use effects to handle grabbing stuff from the URL
  useEffect(() => {
    const urlTeamId = searchParams.get('teamId');
    
    if (urlTeamId) {
      const cleanTeamId = urlTeamId.replace(/[^0-9]/g, '');
      setTeamId(cleanTeamId);
    }
  }, [searchParams]);

  useEffect( () => 
  {
    if(!success)
      {
       alert("unable to find team from id")
      }

  }, [success])
  // ------------------------------------------

  // functions actually used in the HTML
  const handleTeamIdChange = (teamIdUnValidated:string) =>
  {
    const teamId = teamIdUnValidated.trim().replace(/[^0-9]/g, '');

    if (!/^[0-9]*$/.test(teamId)) {
      alert('Please enter only numbers as your teamID');
      return;
    }

    setTeamId(teamId);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('teamId', teamId);
    setSearchParams( newSearchParams)
    console.log("set team id to " + teamId)
  }

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleCopyToClipboard = async  () => {

    function CopyToClipBoardOldFallBack() {
      if (textAreaRef.current) {
        textAreaRef.current.select();
        document.execCommand('copy');
      }
    }

    async function CopyToClipBoardModern() {
      try {
        await navigator.clipboard.writeText(playerNames);
      } catch (error) {
        console.log("failed to use modern clipboard API, using deprecated approach")
        CopyToClipBoardOldFallBack();
      }      
    }    

    if (navigator.clipboard)
    {
      await CopyToClipBoardModern()
    }
    else
    {
      CopyToClipBoardOldFallBack();
    }
    
  };
  //-------------------------------------

  // The actual HTML

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Team To Text</h1>
      <label htmlFor="teamId" style={{ display: 'block', marginBottom: '10px' }}>
        Team ID:
      </label>
      <input
        type="text"
        id="teamId"
        value={teamId}
        pattern="[0-9]*" 
        onChange={(e) => handleTeamIdChange(e.currentTarget.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '20px',
          boxSizing: 'border-box',
        }}
      />
      {gameweek && <p>Current Gameweek: {gameweek}</p>}
      {playerNames && (
        <div>
          <h3 style={{ marginBottom: '10px' }}>Player Names:</h3>
          <textarea
            ref={textAreaRef}
            value={playerNames}
            readOnly
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '10px',
              boxSizing: 'border-box',
              fontFamily: 'monospace', // Use monospace font for better formatting
              whiteSpace: 'pre-wrap', // Preserve line breaks
            }}
          />
          <button
            onClick={handleCopyToClipboard}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
      <h3>How to use</h3>
      <p>All you need is your team id, once you put that in the text box / url then you will have a fast way to get your team in a text format, perfect for youtube comments :)</p>
      <p>To get your team ID:</p>
      <ol> 
        <li>Log on to the main fpl site https://fantasy.premierleague.com/ </li>
        <li> Go to "Points"</li>
        <li> Then in the url you will see your ID </li>
        <li><img src="FPL_TeamID.png"></img></li>
      </ol>      

      </div>
  );

}