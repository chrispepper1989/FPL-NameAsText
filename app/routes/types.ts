// Define TypeScript interfaces for the API responses
export interface Event {
    id: number;
    finished: boolean;
  }
  
  export interface Element {
    id: number;
    web_name: string;
    element_type: number;
    
  }
  
  export interface BootstrapData {
    events: Event[];
    elements: Element[];
  }
  
  export interface Pick {
    element: number;
    is_captain:boolean;
    is_vice_captain:boolean;
  }
  
  export interface TeamPicks {
    picks: Pick[];
  }
  
  export interface LoaderData {
    gameweek: number | null;
    playerNames: string;
    success:boolean;
  }