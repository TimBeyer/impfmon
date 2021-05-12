const IMPFSTOFF_LINK_URL = `https://api.impfstoff.link/?v=0.3&robot=1`;

type DateKey = `${number}-${number}-${number}`
type VenueId = 'arena' | 'tempelhof' | 'messe' | 'velodrom' | 'tegel' | 'erika'

export interface ImpfstoffLinkStats {
  percent: number
  last: number
  count: number
}

export interface ImpstoffLinkVenue {
  id: VenueId
  name: string
  open: boolean
  lastUpdate?: number
  stats: { [date: string]: ImpfstoffLinkStats }
}

export interface ImpfstoffLinkResponse {
  language: string
  stats: ImpstoffLinkVenue[]
}

export const urls = {
  arena: "https://bit.ly/2PL4I8J",
  tempelhof: "https://bit.ly/2PONurc",
  messe: "https://bit.ly/3b0xCJr",
  velodrom: "https://bit.ly/3thD8h7",
  tegel: "https://bit.ly/3eeAIeT",
  erika: "https://bit.ly/2QIki5J",
};


export async function fetchImpfstoffLink(): Promise<ImpfstoffLinkResponse> {
  const request = await fetch(IMPFSTOFF_LINK_URL)
  const response = await request.json()

  return response
}
