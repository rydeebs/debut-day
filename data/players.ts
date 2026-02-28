export type Sport = "baseball" | "basketball" | "football" | "hockey" | "soccer";
export type ObscurityTier = "star" | "average" | "obscure";

export interface Predecessor {
  name: string;
  primary: boolean;
}

export interface LineupPlayer {
  position: string;
  battingOrder?: number; // baseball only
  player: string;
  obscurityTier: ObscurityTier;
}

export interface PlayerData {
  id: string;
  player: string;
  sport: Sport;
  team: string;
  debutDate: string;
  position: string;
  debutNumber: number;
  iconicNumber: number;
  predecessors: Predecessor[];
  debutLineup: LineupPlayer[];
  formation?: string; // soccer e.g. "4-4-2"
}

export const PLAYERS: PlayerData[] = [
  // ─── BASEBALL ────────────────────────────────────────────────────────────
  {
    id: "jimmy-rollins",
    player: "Jimmy Rollins",
    sport: "baseball",
    team: "Philadelphia Phillies",
    debutDate: "2000-09-17",
    position: "SS",
    debutNumber: 29,
    iconicNumber: 11,
    predecessors: [
      { name: "Desi Relaford", primary: true },
      { name: "Tomas Perez", primary: false },
      { name: "Alex Arias", primary: false },
    ],
    debutLineup: [
      { position: "CF", battingOrder: 1, player: "Doug Glanville", obscurityTier: "average" },
      { position: "SS", battingOrder: 2, player: "Jimmy Rollins", obscurityTier: "star" },
      { position: "RF", battingOrder: 3, player: "Bobby Abreu", obscurityTier: "star" },
      { position: "LF", battingOrder: 4, player: "Pat Burrell", obscurityTier: "average" },
      { position: "3B", battingOrder: 5, player: "Scott Rolen", obscurityTier: "star" },
      { position: "1B", battingOrder: 6, player: "Travis Lee", obscurityTier: "obscure" },
      { position: "C",  battingOrder: 7, player: "Mike Lieberthal", obscurityTier: "average" },
      { position: "2B", battingOrder: 8, player: "Marlon Anderson", obscurityTier: "obscure" },
      { position: "P",  battingOrder: 9, player: "Randy Wolf", obscurityTier: "average" },
    ],
  },
  {
    id: "derek-jeter",
    player: "Derek Jeter",
    sport: "baseball",
    team: "New York Yankees",
    debutDate: "1995-05-29",
    position: "SS",
    debutNumber: 2,
    iconicNumber: 2,
    predecessors: [
      { name: "Tony Fernandez", primary: true },
      { name: "Mike Gallego", primary: false },
    ],
    debutLineup: [
      { position: "CF", battingOrder: 1, player: "Bernie Williams", obscurityTier: "star" },
      { position: "SS", battingOrder: 2, player: "Derek Jeter", obscurityTier: "star" },
      { position: "DH", battingOrder: 3, player: "Don Mattingly", obscurityTier: "star" },
      { position: "RF", battingOrder: 4, player: "Paul O'Neill", obscurityTier: "star" },
      { position: "LF", battingOrder: 5, player: "Gerald Williams", obscurityTier: "obscure" },
      { position: "3B", battingOrder: 6, player: "Wade Boggs", obscurityTier: "star" },
      { position: "1B", battingOrder: 7, player: "Tino Martinez", obscurityTier: "average" },
      { position: "C",  battingOrder: 8, player: "Mike Stanley", obscurityTier: "average" },
      { position: "2B", battingOrder: 9, player: "Pat Kelly", obscurityTier: "obscure" },
      { position: "P",  battingOrder: 0, player: "Scott Kamieniecki", obscurityTier: "obscure" },
    ],
  },
  {
    id: "albert-pujols",
    player: "Albert Pujols",
    sport: "baseball",
    team: "St. Louis Cardinals",
    debutDate: "2001-04-02",
    position: "LF",
    debutNumber: 5,
    iconicNumber: 5,
    predecessors: [
      { name: "Craig Paquette", primary: true },
      { name: "Shawon Dunston", primary: false },
    ],
    debutLineup: [
      { position: "CF", battingOrder: 1, player: "Jim Edmonds", obscurityTier: "star" },
      { position: "2B", battingOrder: 2, player: "Fernando Vina", obscurityTier: "average" },
      { position: "1B", battingOrder: 3, player: "Mark McGwire", obscurityTier: "star" },
      { position: "RF", battingOrder: 4, player: "J.D. Drew", obscurityTier: "average" },
      { position: "LF", battingOrder: 5, player: "Albert Pujols", obscurityTier: "star" },
      { position: "3B", battingOrder: 6, player: "Placido Polanco", obscurityTier: "average" },
      { position: "SS", battingOrder: 7, player: "Edgar Renteria", obscurityTier: "average" },
      { position: "C",  battingOrder: 8, player: "Mike Matheny", obscurityTier: "average" },
      { position: "P",  battingOrder: 9, player: "Dustin Hermanson", obscurityTier: "obscure" },
    ],
  },

  // ─── BASKETBALL ──────────────────────────────────────────────────────────
  {
    id: "lebron-james",
    player: "LeBron James",
    sport: "basketball",
    team: "Cleveland Cavaliers",
    debutDate: "2003-10-29",
    position: "SF",
    debutNumber: 23,
    iconicNumber: 23,
    predecessors: [
      { name: "Darius Miles", primary: true },
      { name: "Ricky Davis", primary: false },
    ],
    debutLineup: [
      { position: "PG", player: "Dajuan Wagner", obscurityTier: "average" },
      { position: "SG", player: "Jeff McInnis", obscurityTier: "obscure" },
      { position: "SF", player: "LeBron James", obscurityTier: "star" },
      { position: "PF", player: "Carlos Boozer", obscurityTier: "average" },
      { position: "C",  player: "Zydrunas Ilgauskas", obscurityTier: "average" },
    ],
  },
  {
    id: "kobe-bryant",
    player: "Kobe Bryant",
    sport: "basketball",
    team: "Los Angeles Lakers",
    debutDate: "1996-11-03",
    position: "SG",
    debutNumber: 8,
    iconicNumber: 8,
    predecessors: [
      { name: "Eddie Jones", primary: true },
      { name: "Anthony Peeler", primary: false },
    ],
    debutLineup: [
      { position: "PG", player: "Nick Van Exel", obscurityTier: "average" },
      { position: "SG", player: "Kobe Bryant", obscurityTier: "star" },
      { position: "SF", player: "Eddie Jones", obscurityTier: "average" },
      { position: "PF", player: "Elden Campbell", obscurityTier: "average" },
      { position: "C",  player: "Shaquille O'Neal", obscurityTier: "star" },
    ],
  },
  {
    id: "kevin-durant",
    player: "Kevin Durant",
    sport: "basketball",
    team: "Seattle SuperSonics",
    debutDate: "2007-10-31",
    position: "SF",
    debutNumber: 35,
    iconicNumber: 35,
    predecessors: [
      { name: "Rashard Lewis", primary: true },
      { name: "Mickael Gelabale", primary: false },
    ],
    debutLineup: [
      { position: "PG", player: "Luke Ridnour", obscurityTier: "average" },
      { position: "SG", player: "Wally Szczerbiak", obscurityTier: "average" },
      { position: "SF", player: "Kevin Durant", obscurityTier: "star" },
      { position: "PF", player: "Nick Collison", obscurityTier: "obscure" },
      { position: "C",  player: "Chris Wilcox", obscurityTier: "obscure" },
    ],
  },

  // ─── FOOTBALL ────────────────────────────────────────────────────────────
  {
    id: "patrick-mahomes",
    player: "Patrick Mahomes",
    sport: "football",
    team: "Kansas City Chiefs",
    debutDate: "2017-10-01",
    position: "QB",
    debutNumber: 15,
    iconicNumber: 15,
    predecessors: [{ name: "Alex Smith", primary: true }],
    debutLineup: [
      // Offense
      { position: "QB",  player: "Patrick Mahomes", obscurityTier: "star" },
      { position: "RB",  player: "Kareem Hunt", obscurityTier: "average" },
      { position: "WR1", player: "Tyreek Hill", obscurityTier: "star" },
      { position: "WR2", player: "Albert Wilson", obscurityTier: "obscure" },
      { position: "TE",  player: "Travis Kelce", obscurityTier: "star" },
      { position: "LT",  player: "Eric Fisher", obscurityTier: "average" },
      { position: "LG",  player: "Parker Ehinger", obscurityTier: "obscure" },
      { position: "C",   player: "Mitch Morse", obscurityTier: "average" },
      { position: "RG",  player: "Laurent Duvernay-Tardif", obscurityTier: "obscure" },
      { position: "RT",  player: "Mitchell Schwartz", obscurityTier: "average" },
      // Defense
      { position: "DE1", player: "Justin Houston", obscurityTier: "average" },
      { position: "DT1", player: "Dontari Poe", obscurityTier: "average" },
      { position: "DT2", player: "Allen Bailey", obscurityTier: "obscure" },
      { position: "DE2", player: "Dee Ford", obscurityTier: "average" },
      { position: "OLB", player: "Tamba Hali", obscurityTier: "average" },
      { position: "MLB", player: "Derrick Johnson", obscurityTier: "average" },
      { position: "ILB", player: "Ramik Wilson", obscurityTier: "obscure" },
      { position: "CB1", player: "Marcus Peters", obscurityTier: "average" },
      { position: "CB2", player: "Phillip Gaines", obscurityTier: "obscure" },
      { position: "FS",  player: "Eric Berry", obscurityTier: "average" },
      { position: "SS",  player: "Ron Parker", obscurityTier: "obscure" },
    ],
  },
  {
    id: "tom-brady",
    player: "Tom Brady",
    sport: "football",
    team: "New England Patriots",
    debutDate: "2001-09-30",
    position: "QB",
    debutNumber: 12,
    iconicNumber: 12,
    predecessors: [{ name: "Drew Bledsoe", primary: true }],
    debutLineup: [
      { position: "QB",  player: "Tom Brady", obscurityTier: "star" },
      { position: "RB",  player: "Antowain Smith", obscurityTier: "average" },
      { position: "WR1", player: "Troy Brown", obscurityTier: "average" },
      { position: "WR2", player: "David Patten", obscurityTier: "obscure" },
      { position: "TE",  player: "Jermaine Wiggins", obscurityTier: "obscure" },
      { position: "LT",  player: "Matt Light", obscurityTier: "average" },
      { position: "LG",  player: "Joe Andruzzi", obscurityTier: "obscure" },
      { position: "C",   player: "Damien Woody", obscurityTier: "average" },
      { position: "RG",  player: "Mike Compton", obscurityTier: "obscure" },
      { position: "RT",  player: "Greg Robinson-Randall", obscurityTier: "obscure" },
      { position: "DE1", player: "Willie McGinest", obscurityTier: "average" },
      { position: "DT1", player: "Richard Seymour", obscurityTier: "average" },
      { position: "DT2", player: "Ted Washington", obscurityTier: "average" },
      { position: "DE2", player: "Anthony Pleasant", obscurityTier: "obscure" },
      { position: "OLB", player: "Mike Vrabel", obscurityTier: "average" },
      { position: "MLB", player: "Bryan Cox", obscurityTier: "obscure" },
      { position: "ILB", player: "Tedy Bruschi", obscurityTier: "average" },
      { position: "CB1", player: "Ty Law", obscurityTier: "average" },
      { position: "CB2", player: "Otis Smith", obscurityTier: "obscure" },
      { position: "FS",  player: "Lawyer Milloy", obscurityTier: "average" },
      { position: "SS",  player: "Tebucky Jones", obscurityTier: "obscure" },
    ],
  },
  {
    id: "aaron-rodgers",
    player: "Aaron Rodgers",
    sport: "football",
    team: "Green Bay Packers",
    debutDate: "2008-09-08",
    position: "QB",
    debutNumber: 12,
    iconicNumber: 12,
    predecessors: [{ name: "Brett Favre", primary: true }],
    debutLineup: [
      { position: "QB",  player: "Aaron Rodgers", obscurityTier: "star" },
      { position: "RB",  player: "Ryan Grant", obscurityTier: "average" },
      { position: "WR1", player: "Greg Jennings", obscurityTier: "average" },
      { position: "WR2", player: "Donald Driver", obscurityTier: "average" },
      { position: "TE",  player: "Jermichael Finley", obscurityTier: "average" },
      { position: "LT",  player: "Chad Clifton", obscurityTier: "average" },
      { position: "LG",  player: "Daryn Colledge", obscurityTier: "obscure" },
      { position: "C",   player: "Scott Wells", obscurityTier: "obscure" },
      { position: "RG",  player: "Josh Sitton", obscurityTier: "average" },
      { position: "RT",  player: "Mark Tauscher", obscurityTier: "obscure" },
      { position: "DE1", player: "Kabeer Gbaja-Biamila", obscurityTier: "average" },
      { position: "DT1", player: "Ryan Pickett", obscurityTier: "obscure" },
      { position: "DT2", player: "Colin Cole", obscurityTier: "obscure" },
      { position: "DE2", player: "Aaron Kampman", obscurityTier: "average" },
      { position: "OLB", player: "Brady Poppinga", obscurityTier: "obscure" },
      { position: "MLB", player: "Nick Barnett", obscurityTier: "average" },
      { position: "ILB", player: "A.J. Hawk", obscurityTier: "average" },
      { position: "CB1", player: "Charles Woodson", obscurityTier: "star" },
      { position: "CB2", player: "Al Harris", obscurityTier: "average" },
      { position: "FS",  player: "Atari Bigby", obscurityTier: "obscure" },
      { position: "SS",  player: "Nick Collins", obscurityTier: "average" },
    ],
  },

  // ─── HOCKEY ──────────────────────────────────────────────────────────────
  {
    id: "sidney-crosby",
    player: "Sidney Crosby",
    sport: "hockey",
    team: "Pittsburgh Penguins",
    debutDate: "2005-10-05",
    position: "C",
    debutNumber: 87,
    iconicNumber: 87,
    predecessors: [
      { name: "Mario Lemieux", primary: true },
      { name: "John LeClair", primary: false },
    ],
    debutLineup: [
      { position: "LW", player: "Mark Recchi", obscurityTier: "average" },
      { position: "C",  player: "Sidney Crosby", obscurityTier: "star" },
      { position: "RW", player: "Zigmund Palffy", obscurityTier: "average" },
      { position: "LD", player: "Sergei Gonchar", obscurityTier: "average" },
      { position: "RD", player: "Dick Tarnstrom", obscurityTier: "obscure" },
      { position: "G",  player: "Marc-Andre Fleury", obscurityTier: "star" },
    ],
  },
  {
    id: "alex-ovechkin",
    player: "Alex Ovechkin",
    sport: "hockey",
    team: "Washington Capitals",
    debutDate: "2005-10-05",
    position: "LW",
    debutNumber: 8,
    iconicNumber: 8,
    predecessors: [
      { name: "Jaromir Jagr", primary: true },
      { name: "Peter Bondra", primary: false },
    ],
    debutLineup: [
      { position: "LW", player: "Alex Ovechkin", obscurityTier: "star" },
      { position: "C",  player: "Brian Sutherby", obscurityTier: "obscure" },
      { position: "RW", player: "Dainius Zubrus", obscurityTier: "average" },
      { position: "LD", player: "Brendan Witt", obscurityTier: "obscure" },
      { position: "RD", player: "Nolan Yonkman", obscurityTier: "obscure" },
      { position: "G",  player: "Olaf Kolzig", obscurityTier: "average" },
    ],
  },

  // ─── SOCCER ──────────────────────────────────────────────────────────────
  {
    id: "landon-donovan",
    player: "Landon Donovan",
    sport: "soccer",
    team: "San Jose Earthquakes",
    debutDate: "2001-03-25",
    position: "MF",
    debutNumber: 21,
    iconicNumber: 10,
    formation: "4-4-2",
    predecessors: [
      { name: "Eric Wynalda", primary: true },
      { name: "Manny Lagos", primary: false },
    ],
    debutLineup: [
      { position: "GK",  player: "Pat Onstad", obscurityTier: "average" },
      { position: "RB",  player: "Jeff Agoos", obscurityTier: "average" },
      { position: "CB1", player: "Troy Dayak", obscurityTier: "obscure" },
      { position: "CB2", player: "Craig Waibel", obscurityTier: "obscure" },
      { position: "LB",  player: "Chris Roner", obscurityTier: "obscure" },
      { position: "RM",  player: "Landon Donovan", obscurityTier: "star" },
      { position: "CM1", player: "Ramiro Corrales", obscurityTier: "obscure" },
      { position: "CM2", player: "John Doyle", obscurityTier: "obscure" },
      { position: "LM",  player: "Manny Lagos", obscurityTier: "obscure" },
      { position: "ST1", player: "Ronald Cerritos", obscurityTier: "obscure" },
      { position: "ST2", player: "Rodrigo Faria", obscurityTier: "obscure" },
    ],
  },
  {
    id: "clint-dempsey",
    player: "Clint Dempsey",
    sport: "soccer",
    team: "New England Revolution",
    debutDate: "2004-04-24",
    position: "MF",
    debutNumber: 2,
    iconicNumber: 8,
    formation: "4-4-2",
    predecessors: [
      { name: "Jay Heaps", primary: true },
      { name: "Steve Ralston", primary: false },
    ],
    debutLineup: [
      { position: "GK",  player: "Matt Reis", obscurityTier: "average" },
      { position: "RB",  player: "Steve Ralston", obscurityTier: "average" },
      { position: "CB1", player: "Michael Parkhurst", obscurityTier: "obscure" },
      { position: "CB2", player: "Jay Heaps", obscurityTier: "obscure" },
      { position: "LB",  player: "Shalrie Joseph", obscurityTier: "obscure" },
      { position: "RM",  player: "Clint Dempsey", obscurityTier: "star" },
      { position: "CM1", player: "Andy Dorman", obscurityTier: "obscure" },
      { position: "CM2", player: "Daniel Hernandez", obscurityTier: "obscure" },
      { position: "LM",  player: "Kenny Mansally", obscurityTier: "obscure" },
      { position: "ST1", player: "Taylor Twellman", obscurityTier: "average" },
      { position: "ST2", player: "Avery John", obscurityTier: "obscure" },
    ],
  },
];

export const PLAYERS_BY_SPORT: Record<Sport, PlayerData[]> = {
  baseball:   PLAYERS.filter((p) => p.sport === "baseball"),
  basketball: PLAYERS.filter((p) => p.sport === "basketball"),
  football:   PLAYERS.filter((p) => p.sport === "football"),
  hockey:     PLAYERS.filter((p) => p.sport === "hockey"),
  soccer:     PLAYERS.filter((p) => p.sport === "soccer"),
};
