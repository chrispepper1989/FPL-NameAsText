import { useState, useEffect, useRef } from 'react';
import { requestOptions } from './headers';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { LoaderFunction } from '@vercel/remix';

// Define TypeScript interfaces for the API responses
interface Event {
  id: number;
  finished: boolean;
}

interface Element {
  id: number;
  web_name: string;
  element_type: number;
  
}

interface BootstrapData {
  events: Event[];
  elements: Element[];
}

interface Pick {
  element: number;
  is_captain:boolean;
  is_vice_captain:boolean;
}

interface TeamPicks {
  picks: Pick[];
}

interface LoaderData {
  gameweek: number | null;
  playerNames: string;
  success:boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const teamId = url.searchParams.get('teamId');



  const bootstrapResponse = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', requestOptions);
  const bootstrapData: BootstrapData = await bootstrapResponse.json();

  let currentWeek = 1;
  bootstrapData.events.forEach((element) => {
    if (element.finished) {
      currentWeek = element.id;
    }
  });

  let playerNames = '';
  if (teamId && currentWeek) {
    const cleanTeamId = teamId.replace(/[^0-9]/g, '');
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

export default function Index() {
  const { gameweek, playerNames, success } = useLoaderData<LoaderData>();
  const [teamId, setTeamId] = useState<string>('');
   const [searchParams, setSearchParams] = useSearchParams();

   

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