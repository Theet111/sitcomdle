import { SHOWS_BY_ID } from "./shows";
import type { Character, CharacterSeed } from "./types";

/**
 * Character database.
 *
 * Adding a character = appending one row below. Location is inherited from the
 * show unless the seed overrides `city` / `region`.
 *
 * Conventions:
 *  - `age` is the character's age at their first appearance.
 *  - `occupation` is the character's best-known job title (kept short so it fits
 *    a grid cell); `field` is the broader career family used for partial matches.
 */
const SEEDS: CharacterSeed[] = [
  // ---------------------------------------------------------------- The Office
  { id: "michael-scott", name: "Michael Scott", showId: "the-office", gender: "Male", role: "Lead", occupation: "Regional Manager", field: "Management", age: 40, debutSeason: 1 },
  { id: "dwight-schrute", name: "Dwight Schrute", showId: "the-office", gender: "Male", role: "Main", occupation: "Asst. to the Manager", field: "Sales", age: 34, debutSeason: 1 },
  { id: "jim-halpert", name: "Jim Halpert", showId: "the-office", gender: "Male", role: "Main", occupation: "Sales Rep", field: "Sales", age: 27, debutSeason: 1 },
  { id: "pam-beesly", name: "Pam Beesly", showId: "the-office", gender: "Female", role: "Main", occupation: "Receptionist", field: "Administration", age: 26, debutSeason: 1 },
  { id: "andy-bernard", name: "Andy Bernard", showId: "the-office", gender: "Male", role: "Main", occupation: "Sales Rep", field: "Sales", age: 33, debutSeason: 3 },
  { id: "ryan-howard", name: "Ryan Howard", showId: "the-office", gender: "Male", role: "Supporting", occupation: "Temp", field: "Administration", age: 26, debutSeason: 1 },
  { id: "kevin-malone", name: "Kevin Malone", showId: "the-office", gender: "Male", role: "Supporting", occupation: "Accountant", field: "Finance", age: 38, debutSeason: 1 },
  { id: "angela-martin", name: "Angela Martin", showId: "the-office", gender: "Female", role: "Supporting", occupation: "Accountant", field: "Finance", age: 30, debutSeason: 1 },
  { id: "oscar-martinez", name: "Oscar Martinez", showId: "the-office", gender: "Male", role: "Supporting", occupation: "Accountant", field: "Finance", age: 30, debutSeason: 1 },
  { id: "stanley-hudson", name: "Stanley Hudson", showId: "the-office", gender: "Male", role: "Supporting", occupation: "Sales Rep", field: "Sales", age: 47, debutSeason: 1 },
  { id: "phyllis-vance", name: "Phyllis Vance", showId: "the-office", gender: "Female", role: "Supporting", occupation: "Sales Rep", field: "Sales", age: 50, debutSeason: 1 },
  { id: "kelly-kapoor", name: "Kelly Kapoor", showId: "the-office", gender: "Female", role: "Supporting", occupation: "Customer Service", field: "Customer Service", age: 25, debutSeason: 1 },
  { id: "toby-flenderson", name: "Toby Flenderson", showId: "the-office", gender: "Male", role: "Supporting", occupation: "HR Rep", field: "Human Resources", age: 40, debutSeason: 1 },
  { id: "creed-bratton", name: "Creed Bratton", showId: "the-office", gender: "Male", role: "Supporting", occupation: "Quality Assurance", field: "Operations", age: 60, debutSeason: 1 },
  { id: "meredith-palmer", name: "Meredith Palmer", showId: "the-office", gender: "Female", role: "Supporting", occupation: "Supplier Relations", field: "Operations", age: 43, debutSeason: 1 },
  { id: "erin-hannon", name: "Erin Hannon", showId: "the-office", gender: "Female", role: "Supporting", occupation: "Receptionist", field: "Administration", age: 25, debutSeason: 5 },
  { id: "holly-flax", name: "Holly Flax", showId: "the-office", gender: "Female", role: "Recurring", occupation: "HR Rep", field: "Human Resources", age: 35, debutSeason: 4 },
  { id: "jan-levinson", name: "Jan Levinson", showId: "the-office", gender: "Female", role: "Recurring", occupation: "Corporate Exec", field: "Management", age: 40, debutSeason: 1 },

  // ------------------------------------------------------------------- Friends
  { id: "ross-geller", name: "Ross Geller", showId: "friends", gender: "Male", role: "Main", occupation: "Paleontologist", field: "Science", age: 26, debutSeason: 1 },
  { id: "rachel-green", name: "Rachel Green", showId: "friends", gender: "Female", role: "Main", occupation: "Waitress", field: "Food Service", age: 24, debutSeason: 1 },
  { id: "monica-geller", name: "Monica Geller", showId: "friends", gender: "Female", role: "Main", occupation: "Chef", field: "Food Service", age: 25, debutSeason: 1 },
  { id: "chandler-bing", name: "Chandler Bing", showId: "friends", gender: "Male", role: "Main", occupation: "Data Analyst", field: "Business", age: 25, debutSeason: 1 },
  { id: "joey-tribbiani", name: "Joey Tribbiani", showId: "friends", gender: "Male", role: "Main", occupation: "Actor", field: "Entertainment", age: 25, debutSeason: 1 },
  { id: "phoebe-buffay", name: "Phoebe Buffay", showId: "friends", gender: "Female", role: "Main", occupation: "Masseuse", field: "Wellness", age: 26, debutSeason: 1 },
  { id: "gunther", name: "Gunther", showId: "friends", gender: "Male", role: "Recurring", occupation: "Barista", field: "Food Service", age: 30, debutSeason: 1 },
  { id: "mike-hannigan", name: "Mike Hannigan", showId: "friends", gender: "Male", role: "Recurring", occupation: "Pianist", field: "Music", age: 32, debutSeason: 9 },
  { id: "richard-burke", name: "Richard Burke", showId: "friends", gender: "Male", role: "Recurring", occupation: "Ophthalmologist", field: "Healthcare", age: 49, debutSeason: 2 },

  // ------------------------------------------------------- Parks and Recreation
  { id: "leslie-knope", name: "Leslie Knope", showId: "parks-and-rec", gender: "Female", role: "Lead", occupation: "Deputy Director", field: "Government", age: 34, debutSeason: 1 },
  { id: "ron-swanson", name: "Ron Swanson", showId: "parks-and-rec", gender: "Male", role: "Main", occupation: "Parks Director", field: "Government", age: 44, debutSeason: 1 },
  { id: "tom-haverford", name: "Tom Haverford", showId: "parks-and-rec", gender: "Male", role: "Main", occupation: "Parks Admin", field: "Government", age: 29, debutSeason: 1 },
  { id: "april-ludgate", name: "April Ludgate", showId: "parks-and-rec", gender: "Female", role: "Main", occupation: "Intern", field: "Government", age: 20, debutSeason: 1 },
  { id: "andy-dwyer", name: "Andy Dwyer", showId: "parks-and-rec", gender: "Male", role: "Main", occupation: "Musician", field: "Music", age: 28, debutSeason: 1 },
  { id: "ben-wyatt", name: "Ben Wyatt", showId: "parks-and-rec", gender: "Male", role: "Main", occupation: "State Auditor", field: "Government", age: 34, debutSeason: 2 },
  { id: "ann-perkins", name: "Ann Perkins", showId: "parks-and-rec", gender: "Female", role: "Main", occupation: "Nurse", field: "Healthcare", age: 29, debutSeason: 1 },
  { id: "chris-traeger", name: "Chris Traeger", showId: "parks-and-rec", gender: "Male", role: "Main", occupation: "City Manager", field: "Government", age: 43, debutSeason: 2 },
  { id: "jerry-gergich", name: "Jerry Gergich", showId: "parks-and-rec", gender: "Male", role: "Supporting", occupation: "Parks Admin", field: "Government", age: 60, debutSeason: 1 },
  { id: "donna-meagle", name: "Donna Meagle", showId: "parks-and-rec", gender: "Female", role: "Supporting", occupation: "Office Manager", field: "Government", age: 40, debutSeason: 1 },

  // -------------------------------------------------------- Brooklyn Nine-Nine
  { id: "jake-peralta", name: "Jake Peralta", showId: "brooklyn-99", gender: "Male", role: "Lead", occupation: "Detective", field: "Law Enforcement", age: 32, debutSeason: 1 },
  { id: "amy-santiago", name: "Amy Santiago", showId: "brooklyn-99", gender: "Female", role: "Main", occupation: "Detective", field: "Law Enforcement", age: 31, debutSeason: 1 },
  { id: "raymond-holt", name: "Raymond Holt", showId: "brooklyn-99", gender: "Male", role: "Main", occupation: "Police Captain", field: "Law Enforcement", age: 60, debutSeason: 1 },
  { id: "terry-jeffords", name: "Terry Jeffords", showId: "brooklyn-99", gender: "Male", role: "Main", occupation: "Sergeant", field: "Law Enforcement", age: 38, debutSeason: 1 },
  { id: "rosa-diaz", name: "Rosa Diaz", showId: "brooklyn-99", gender: "Female", role: "Main", occupation: "Detective", field: "Law Enforcement", age: 30, debutSeason: 1 },
  { id: "charles-boyle", name: "Charles Boyle", showId: "brooklyn-99", gender: "Male", role: "Main", occupation: "Detective", field: "Law Enforcement", age: 36, debutSeason: 1 },
  { id: "gina-linetti", name: "Gina Linetti", showId: "brooklyn-99", gender: "Female", role: "Main", occupation: "Civilian Admin", field: "Administration", age: 29, debutSeason: 1 },

  // ------------------------------------------------------------------ Seinfeld
  { id: "jerry-seinfeld", name: "Jerry Seinfeld", showId: "seinfeld", gender: "Male", role: "Lead", occupation: "Comedian", field: "Entertainment", age: 35, debutSeason: 1 },
  { id: "george-costanza", name: "George Costanza", showId: "seinfeld", gender: "Male", role: "Main", occupation: "Unemployed", field: "Unemployed", age: 35, debutSeason: 1 },
  { id: "elaine-benes", name: "Elaine Benes", showId: "seinfeld", gender: "Female", role: "Main", occupation: "Book Editor", field: "Publishing", age: 29, debutSeason: 2 },
  { id: "cosmo-kramer", name: "Cosmo Kramer", showId: "seinfeld", gender: "Male", role: "Main", occupation: "Unemployed", field: "Unemployed", age: 39, debutSeason: 1 },
  { id: "newman", name: "Newman", showId: "seinfeld", gender: "Male", role: "Recurring", occupation: "Mail Carrier", field: "Postal", age: 40, debutSeason: 3 },

  // ------------------------------------------------------ How I Met Your Mother
  { id: "ted-mosby", name: "Ted Mosby", showId: "himym", gender: "Male", role: "Lead", occupation: "Architect", field: "Architecture", age: 27, debutSeason: 1 },
  { id: "marshall-eriksen", name: "Marshall Eriksen", showId: "himym", gender: "Male", role: "Main", occupation: "Law Student", field: "Law", age: 27, debutSeason: 1 },
  { id: "lily-aldrin", name: "Lily Aldrin", showId: "himym", gender: "Female", role: "Main", occupation: "Kindergarten Teacher", field: "Education", age: 27, debutSeason: 1 },
  { id: "barney-stinson", name: "Barney Stinson", showId: "himym", gender: "Male", role: "Main", occupation: "Corporate Exec", field: "Business", age: 30, debutSeason: 1 },
  { id: "robin-scherbatsky", name: "Robin Scherbatsky", showId: "himym", gender: "Female", role: "Main", occupation: "News Reporter", field: "Journalism", age: 25, debutSeason: 1 },

  // ------------------------------------------------------- The Big Bang Theory
  { id: "sheldon-cooper", name: "Sheldon Cooper", showId: "big-bang", gender: "Male", role: "Lead", occupation: "Physicist", field: "Science", age: 27, debutSeason: 1 },
  { id: "leonard-hofstadter", name: "Leonard Hofstadter", showId: "big-bang", gender: "Male", role: "Main", occupation: "Physicist", field: "Science", age: 26, debutSeason: 1 },
  { id: "penny", name: "Penny", showId: "big-bang", gender: "Female", role: "Main", occupation: "Waitress", field: "Food Service", age: 22, debutSeason: 1 },
  { id: "howard-wolowitz", name: "Howard Wolowitz", showId: "big-bang", gender: "Male", role: "Main", occupation: "Engineer", field: "Engineering", age: 26, debutSeason: 1 },
  { id: "raj-koothrappali", name: "Raj Koothrappali", showId: "big-bang", gender: "Male", role: "Main", occupation: "Astrophysicist", field: "Science", age: 26, debutSeason: 1 },
  { id: "amy-farrah-fowler", name: "Amy Farrah Fowler", showId: "big-bang", gender: "Female", role: "Main", occupation: "Neurobiologist", field: "Science", age: 30, debutSeason: 3 },
  { id: "bernadette-rostenkowski", name: "Bernadette Rostenkowski", showId: "big-bang", gender: "Female", role: "Main", occupation: "Microbiologist", field: "Science", age: 25, debutSeason: 3 },

  // ----------------------------------------------------------------- Community
  { id: "jeff-winger", name: "Jeff Winger", showId: "community", gender: "Male", role: "Lead", occupation: "Lawyer", field: "Law", age: 34, debutSeason: 1 },
  { id: "abed-nadir", name: "Abed Nadir", showId: "community", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 20, debutSeason: 1 },
  { id: "britta-perry", name: "Britta Perry", showId: "community", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 28, debutSeason: 1 },
  { id: "troy-barnes", name: "Troy Barnes", showId: "community", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 19, debutSeason: 1 },
  { id: "annie-edison", name: "Annie Edison", showId: "community", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 19, debutSeason: 1 },
  { id: "shirley-bennett", name: "Shirley Bennett", showId: "community", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 38, debutSeason: 1 },
  { id: "craig-pelton", name: "Craig Pelton", showId: "community", gender: "Male", role: "Supporting", occupation: "Dean", field: "Education", age: 45, debutSeason: 1 },

  // ------------------------------------------------------------- Modern Family
  { id: "phil-dunphy", name: "Phil Dunphy", showId: "modern-family", gender: "Male", role: "Main", occupation: "Realtor", field: "Real Estate", age: 40, debutSeason: 1 },
  { id: "claire-dunphy", name: "Claire Dunphy", showId: "modern-family", gender: "Female", role: "Main", occupation: "Homemaker", field: "Homemaker", age: 39, debutSeason: 1 },
  { id: "jay-pritchett", name: "Jay Pritchett", showId: "modern-family", gender: "Male", role: "Main", occupation: "Business Owner", field: "Business", age: 63, debutSeason: 1 },
  { id: "gloria-delgado", name: "Gloria Delgado", showId: "modern-family", gender: "Female", role: "Main", occupation: "Homemaker", field: "Homemaker", age: 38, debutSeason: 1 },
  { id: "cameron-tucker", name: "Cameron Tucker", showId: "modern-family", gender: "Male", role: "Main", occupation: "Music Teacher", field: "Education", age: 38, debutSeason: 1 },
  { id: "mitchell-pritchett", name: "Mitchell Pritchett", showId: "modern-family", gender: "Male", role: "Main", occupation: "Lawyer", field: "Law", age: 36, debutSeason: 1 },
  { id: "haley-dunphy", name: "Haley Dunphy", showId: "modern-family", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 16, debutSeason: 1 },
  { id: "alex-dunphy", name: "Alex Dunphy", showId: "modern-family", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 12, debutSeason: 1 },
  { id: "luke-dunphy", name: "Luke Dunphy", showId: "modern-family", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 11, debutSeason: 1 },
  { id: "manny-delgado", name: "Manny Delgado", showId: "modern-family", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 11, debutSeason: 1 },

  // ------------------------------------------ It's Always Sunny in Philadelphia
  { id: "charlie-kelly", name: "Charlie Kelly", showId: "always-sunny", gender: "Male", role: "Main", occupation: "Janitor", field: "Maintenance", age: 29, debutSeason: 1 },
  { id: "dennis-reynolds", name: "Dennis Reynolds", showId: "always-sunny", gender: "Male", role: "Main", occupation: "Bar Owner", field: "Hospitality", age: 30, debutSeason: 1 },
  { id: "dee-reynolds", name: "Dee Reynolds", showId: "always-sunny", gender: "Female", role: "Main", occupation: "Bartender", field: "Hospitality", age: 30, debutSeason: 1 },
  { id: "mac", name: "Mac", showId: "always-sunny", gender: "Male", role: "Main", occupation: "Bar Owner", field: "Hospitality", age: 30, debutSeason: 1 },
  { id: "frank-reynolds", name: "Frank Reynolds", showId: "always-sunny", gender: "Male", role: "Main", occupation: "Businessman", field: "Business", age: 61, debutSeason: 2 },

  // ------------------------------------------------------------------- 30 Rock
  { id: "liz-lemon", name: "Liz Lemon", showId: "thirty-rock", gender: "Female", role: "Lead", occupation: "Head Writer", field: "Entertainment", age: 36, debutSeason: 1 },
  { id: "jack-donaghy", name: "Jack Donaghy", showId: "thirty-rock", gender: "Male", role: "Main", occupation: "TV Executive", field: "Management", age: 48, debutSeason: 1 },
  { id: "tracy-jordan", name: "Tracy Jordan", showId: "thirty-rock", gender: "Male", role: "Main", occupation: "Actor", field: "Entertainment", age: 38, debutSeason: 1 },
  { id: "jenna-maroney", name: "Jenna Maroney", showId: "thirty-rock", gender: "Female", role: "Main", occupation: "Actress", field: "Entertainment", age: 36, debutSeason: 1 },
  { id: "kenneth-parcell", name: "Kenneth Parcell", showId: "thirty-rock", gender: "Male", role: "Main", occupation: "NBC Page", field: "Entertainment", age: 25, debutSeason: 1 },

  // -------------------------------------------------------------------- Cheers
  { id: "sam-malone", name: "Sam Malone", showId: "cheers", gender: "Male", role: "Lead", occupation: "Bar Owner", field: "Hospitality", age: 34, debutSeason: 1 },
  { id: "diane-chambers", name: "Diane Chambers", showId: "cheers", gender: "Female", role: "Main", occupation: "Waitress", field: "Food Service", age: 26, debutSeason: 1 },
  { id: "norm-peterson", name: "Norm Peterson", showId: "cheers", gender: "Male", role: "Main", occupation: "Accountant", field: "Finance", age: 34, debutSeason: 1 },
  { id: "cliff-clavin", name: "Cliff Clavin", showId: "cheers", gender: "Male", role: "Main", occupation: "Mail Carrier", field: "Postal", age: 33, debutSeason: 1 },
  { id: "woody-boyd", name: "Woody Boyd", showId: "cheers", gender: "Male", role: "Main", occupation: "Bartender", field: "Hospitality", age: 22, debutSeason: 4 },
  { id: "rebecca-howe", name: "Rebecca Howe", showId: "cheers", gender: "Female", role: "Main", occupation: "Bar Manager", field: "Hospitality", age: 34, debutSeason: 6 },

  // ------------------------------------------------------------------- Frasier
  { id: "frasier-crane", name: "Frasier Crane", showId: "frasier", gender: "Male", role: "Lead", occupation: "Radio Psychiatrist", field: "Healthcare", age: 40, debutSeason: 1 },
  { id: "niles-crane", name: "Niles Crane", showId: "frasier", gender: "Male", role: "Main", occupation: "Psychiatrist", field: "Healthcare", age: 38, debutSeason: 1 },
  { id: "martin-crane", name: "Martin Crane", showId: "frasier", gender: "Male", role: "Main", occupation: "Retired Cop", field: "Law Enforcement", age: 65, debutSeason: 1 },
  { id: "daphne-moon", name: "Daphne Moon", showId: "frasier", gender: "Female", role: "Main", occupation: "Physical Therapist", field: "Healthcare", age: 30, debutSeason: 1 },
  { id: "roz-doyle", name: "Roz Doyle", showId: "frasier", gender: "Female", role: "Main", occupation: "Radio Producer", field: "Broadcasting", age: 34, debutSeason: 1 },

  // -------------------------------------------------------------------- Scrubs
  { id: "jd-dorian", name: "J.D. Dorian", showId: "scrubs", gender: "Male", role: "Lead", occupation: "Doctor", field: "Healthcare", age: 25, debutSeason: 1 },
  { id: "turk", name: "Turk", showId: "scrubs", gender: "Male", role: "Main", occupation: "Surgeon", field: "Healthcare", age: 25, debutSeason: 1 },
  { id: "elliot-reid", name: "Elliot Reid", showId: "scrubs", gender: "Female", role: "Main", occupation: "Doctor", field: "Healthcare", age: 25, debutSeason: 1 },
  { id: "perry-cox", name: "Perry Cox", showId: "scrubs", gender: "Male", role: "Main", occupation: "Doctor", field: "Healthcare", age: 40, debutSeason: 1 },
  { id: "carla-espinosa", name: "Carla Espinosa", showId: "scrubs", gender: "Female", role: "Main", occupation: "Nurse", field: "Healthcare", age: 32, debutSeason: 1 },
  { id: "bob-kelso", name: "Bob Kelso", showId: "scrubs", gender: "Male", role: "Main", occupation: "Chief of Medicine", field: "Healthcare", age: 60, debutSeason: 1 },
  { id: "the-janitor", name: "The Janitor", showId: "scrubs", gender: "Male", role: "Main", occupation: "Janitor", field: "Maintenance", age: 35, debutSeason: 1 },

  // ------------------------------------------------------------------ New Girl
  { id: "jess-day", name: "Jess Day", showId: "new-girl", gender: "Female", role: "Lead", occupation: "Teacher", field: "Education", age: 28, debutSeason: 1 },
  { id: "nick-miller", name: "Nick Miller", showId: "new-girl", gender: "Male", role: "Main", occupation: "Bartender", field: "Hospitality", age: 30, debutSeason: 1 },
  { id: "schmidt", name: "Schmidt", showId: "new-girl", gender: "Male", role: "Main", occupation: "Marketing Assoc", field: "Marketing", age: 29, debutSeason: 1 },
  { id: "winston-bishop", name: "Winston Bishop", showId: "new-girl", gender: "Male", role: "Main", occupation: "Police Officer", field: "Law Enforcement", age: 29, debutSeason: 1 },
  { id: "cece-parekh", name: "Cece Parekh", showId: "new-girl", gender: "Female", role: "Main", occupation: "Model", field: "Fashion", age: 28, debutSeason: 1 },

  // ------------------------------------------------------- Arrested Development
  { id: "michael-bluth", name: "Michael Bluth", showId: "arrested-development", gender: "Male", role: "Lead", occupation: "Businessman", field: "Business", age: 37, debutSeason: 1 },
  { id: "gob-bluth", name: "Gob Bluth", showId: "arrested-development", gender: "Male", role: "Main", occupation: "Magician", field: "Entertainment", age: 39, debutSeason: 1 },
  { id: "tobias-funke", name: "Tobias Fünke", showId: "arrested-development", gender: "Male", role: "Main", occupation: "Therapist", field: "Healthcare", age: 42, debutSeason: 1 },
  { id: "lindsay-bluth", name: "Lindsay Bluth", showId: "arrested-development", gender: "Female", role: "Main", occupation: "Socialite", field: "Unemployed", age: 36, debutSeason: 1 },
  { id: "buster-bluth", name: "Buster Bluth", showId: "arrested-development", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 32, debutSeason: 1 },
  { id: "lucille-bluth", name: "Lucille Bluth", showId: "arrested-development", gender: "Female", role: "Main", occupation: "Matriarch", field: "Homemaker", age: 63, debutSeason: 1 },
  { id: "george-michael-bluth", name: "George Michael Bluth", showId: "arrested-development", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 14, debutSeason: 1 },
  { id: "maeby-funke", name: "Maeby Fünke", showId: "arrested-development", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 15, debutSeason: 1 },

  // ---------------------------------------------------------------- Full House
  { id: "danny-tanner", name: "Danny Tanner", showId: "full-house", gender: "Male", role: "Lead", occupation: "TV Host", field: "Broadcasting", age: 33, debutSeason: 1 },
  { id: "jesse-katsopolis", name: "Jesse Katsopolis", showId: "full-house", gender: "Male", role: "Main", occupation: "Musician", field: "Music", age: 25, debutSeason: 1 },
  { id: "joey-gladstone", name: "Joey Gladstone", showId: "full-house", gender: "Male", role: "Main", occupation: "Comedian", field: "Entertainment", age: 30, debutSeason: 1 },
  { id: "dj-tanner", name: "D.J. Tanner", showId: "full-house", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 10, debutSeason: 1 },
  { id: "stephanie-tanner", name: "Stephanie Tanner", showId: "full-house", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 5, debutSeason: 1 },
  { id: "michelle-tanner", name: "Michelle Tanner", showId: "full-house", gender: "Female", role: "Main", occupation: "Toddler", field: "Student", age: 1, debutSeason: 1 },
  { id: "becky-katsopolis", name: "Becky Katsopolis", showId: "full-house", gender: "Female", role: "Supporting", occupation: "TV Host", field: "Broadcasting", age: 26, debutSeason: 2 },

  // ------------------------------------------------------------ That '70s Show
  { id: "eric-forman", name: "Eric Forman", showId: "that-70s-show", gender: "Male", role: "Lead", occupation: "Student", field: "Student", age: 16, debutSeason: 1 },
  { id: "donna-pinciotti", name: "Donna Pinciotti", showId: "that-70s-show", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 16, debutSeason: 1 },
  { id: "steven-hyde", name: "Steven Hyde", showId: "that-70s-show", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 17, debutSeason: 1 },
  { id: "michael-kelso", name: "Michael Kelso", showId: "that-70s-show", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 17, debutSeason: 1 },
  { id: "jackie-burkhart", name: "Jackie Burkhart", showId: "that-70s-show", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 15, debutSeason: 1 },
  { id: "fez", name: "Fez", showId: "that-70s-show", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 17, debutSeason: 1 },
  { id: "red-forman", name: "Red Forman", showId: "that-70s-show", gender: "Male", role: "Supporting", occupation: "Plant Manager", field: "Management", age: 47, debutSeason: 1 },
  { id: "kitty-forman", name: "Kitty Forman", showId: "that-70s-show", gender: "Female", role: "Supporting", occupation: "Nurse", field: "Healthcare", age: 44, debutSeason: 1 },

  // ---------------------------------------------------------------- Superstore
  { id: "amy-sosa", name: "Amy Sosa", showId: "superstore", gender: "Female", role: "Lead", occupation: "Floor Supervisor", field: "Retail", age: 27, debutSeason: 1 },
  { id: "jonah-simms", name: "Jonah Simms", showId: "superstore", gender: "Male", role: "Main", occupation: "Sales Associate", field: "Retail", age: 28, debutSeason: 1 },
  { id: "dina-fox", name: "Dina Fox", showId: "superstore", gender: "Female", role: "Main", occupation: "Assistant Manager", field: "Retail", age: 35, debutSeason: 1 },
  { id: "glenn-sturgis", name: "Glenn Sturgis", showId: "superstore", gender: "Male", role: "Main", occupation: "Store Manager", field: "Retail", age: 55, debutSeason: 1 },
  { id: "garrett-mcneill", name: "Garrett McNeill", showId: "superstore", gender: "Male", role: "Main", occupation: "Announcer", field: "Retail", age: 30, debutSeason: 1 },
  { id: "mateo-liwanag", name: "Mateo Liwanag", showId: "superstore", gender: "Male", role: "Main", occupation: "Sales Associate", field: "Retail", age: 26, debutSeason: 1 },

  // --------------------------------------------------- Everybody Loves Raymond
  { id: "ray-barone", name: "Ray Barone", showId: "raymond", gender: "Male", role: "Lead", occupation: "Sportswriter", field: "Journalism", age: 38, debutSeason: 1 },
  { id: "debra-barone", name: "Debra Barone", showId: "raymond", gender: "Female", role: "Main", occupation: "Homemaker", field: "Homemaker", age: 36, debutSeason: 1 },
  { id: "robert-barone", name: "Robert Barone", showId: "raymond", gender: "Male", role: "Main", occupation: "Police Officer", field: "Law Enforcement", age: 42, debutSeason: 1 },
  { id: "frank-barone", name: "Frank Barone", showId: "raymond", gender: "Male", role: "Main", occupation: "Retired Bookkeeper", field: "Finance", age: 65, debutSeason: 1 },
  { id: "marie-barone", name: "Marie Barone", showId: "raymond", gender: "Female", role: "Main", occupation: "Homemaker", field: "Homemaker", age: 63, debutSeason: 1 },

  // -------------------------------------------------------- The King of Queens
  { id: "doug-heffernan", name: "Doug Heffernan", showId: "king-of-queens", gender: "Male", role: "Lead", occupation: "Delivery Driver", field: "Operations", age: 34, debutSeason: 1 },
  { id: "carrie-heffernan", name: "Carrie Heffernan", showId: "king-of-queens", gender: "Female", role: "Main", occupation: "Legal Secretary", field: "Law", age: 30, debutSeason: 1 },
  { id: "arthur-spooner", name: "Arthur Spooner", showId: "king-of-queens", gender: "Male", role: "Main", occupation: "Retired", field: "Unemployed", age: 70, debutSeason: 1 },

  // --------------------------------------------------------- The Golden Girls
  { id: "dorothy-zbornak", name: "Dorothy Zbornak", showId: "golden-girls", gender: "Female", role: "Main", occupation: "Substitute Teacher", field: "Education", age: 55, debutSeason: 1 },
  { id: "rose-nylund", name: "Rose Nylund", showId: "golden-girls", gender: "Female", role: "Main", occupation: "Grief Counselor", field: "Wellness", age: 55, debutSeason: 1 },
  { id: "blanche-devereaux", name: "Blanche Devereaux", showId: "golden-girls", gender: "Female", role: "Main", occupation: "Museum Guide", field: "Arts", age: 53, debutSeason: 1 },
  { id: "sophia-petrillo", name: "Sophia Petrillo", showId: "golden-girls", gender: "Female", role: "Main", occupation: "Retired", field: "Unemployed", age: 80, debutSeason: 1 },
];

/** Every playable character, with its show data resolved. Sorted by name for the search list. */
export const CHARACTERS: Character[] = SEEDS.map((seed) => {
  const show = SHOWS_BY_ID[seed.showId];
  if (!show) {
    throw new Error(`Unknown showId "${seed.showId}" for character "${seed.id}"`);
  }
  return {
    ...seed,
    show,
    city: seed.city ?? show.city,
    region: seed.region ?? show.region,
    country: show.country,
  };
}).sort((a, b) => a.name.localeCompare(b.name));

export const CHARACTERS_BY_ID: Record<string, Character> = Object.fromEntries(
  CHARACTERS.map((character) => [character.id, character]),
);

export function getCharacter(id: string): Character | undefined {
  return CHARACTERS_BY_ID[id];
}
