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
  arena:
    "https://www.doctolib.de/institut/berlin/ciz-berlin-berlin?pid=practice-158431",
  tempelhof:
    "https://www.doctolib.de/institut/berlin/ciz-berlin-berlin?pid=practice-158433",
  messe:
    "https://www.doctolib.de/institut/berlin/ciz-berlin-berlin?pid=practice-158434",
  velodrom:
    "https://www.doctolib.de/institut/berlin/ciz-berlin-berlin?pid=practice-158435",
  tegel:
    "https://www.doctolib.de/institut/berlin/ciz-berlin-berlin?pid=practice-158436",
  erika:
    "https://www.doctolib.de/institut/berlin/ciz-berlin-berlin?pid=practice-158437",
};


export async function fetchImpfstoffLink(): Promise<ImpfstoffLinkResponse> {
  const request = await fetch(IMPFSTOFF_LINK_URL)
  const response = await request.json()

  return response
}
