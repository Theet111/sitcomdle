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
  // -------------------------------------------------------------------- Friends
  { id: "rachel-green", name: "Rachel Green", showId: "friends", gender: "Female", role: "Main", occupation: "Fashion Buyer", field: "Fashion", age: 25, debutSeason: 1, debutYear: 1994 },
  { id: "ross-geller", name: "Ross Geller", showId: "friends", gender: "Male", role: "Main", occupation: "Paleontologist", field: "Education", age: 27, debutSeason: 1, debutYear: 1994 },
  { id: "monica-geller", name: "Monica Geller", showId: "friends", gender: "Female", role: "Main", occupation: "Chef", field: "Hospitality", age: 25, debutSeason: 1, debutYear: 1994 },
  { id: "chandler-bing", name: "Chandler Bing", showId: "friends", gender: "Male", role: "Main", occupation: "Statistical Analyst", field: "Business", age: 26, debutSeason: 1, debutYear: 1994 },
  { id: "joey-tribbiani", name: "Joey Tribbiani", showId: "friends", gender: "Male", role: "Main", occupation: "Actor", field: "Entertainment", age: 26, debutSeason: 1, debutYear: 1994 },
  { id: "phoebe-buffay", name: "Phoebe Buffay", showId: "friends", gender: "Female", role: "Main", occupation: "Massage Therapist", field: "Healthcare", age: 27, debutSeason: 1, debutYear: 1994 },
  { id: "gunther-friends", name: "Gunther", showId: "friends", gender: "Male", role: "Recurring", occupation: "Coffee Shop Manager", field: "Hospitality", age: 32, debutSeason: 1, debutYear: 1994 },
  { id: "janice-litman", name: "Janice Litman-Goralnik", showId: "friends", gender: "Female", role: "Recurring", occupation: "Businesswoman", field: "Business", age: 31, debutSeason: 1, debutYear: 1994 },
  { id: "richard-burke", name: "Richard Burke", showId: "friends", gender: "Male", role: "Recurring", occupation: "Ophthalmologist", field: "Healthcare", age: 48, debutSeason: 2, debutYear: 1996 },
  { id: "mike-hannigan", name: "Mike Hannigan", showId: "friends", gender: "Male", role: "Recurring", occupation: "Pianist", field: "Music", age: 33, debutSeason: 9, debutYear: 2002 },

  // ---------------------------------------------------------------- The Office
  { id: "michael-scott", name: "Michael Scott", showId: "the-office", gender: "Male", role: "Lead", occupation: "Regional Manager", field: "Management", age: 40, debutSeason: 1 },
  { id: "dwight-schrute", name: "Dwight Schrute", showId: "the-office", gender: "Male", role: "Main", occupation: "Asst. to the Manager", field: "Sales", age: 34, debutSeason: 1 },
  { id: "jim-halpert", name: "Jim Halpert", showId: "the-office", gender: "Male", role: "Main", occupation: "Sales Rep", field: "Sales", age: 27, debutSeason: 1 },
  { id: "pam-beesly", name: "Pam Beesly", showId: "the-office", gender: "Female", role: "Main", occupation: "Receptionist", field: "Administration", age: 26, debutSeason: 1 },
  { id: "andy-bernard", name: "Andy Bernard", showId: "the-office", gender: "Male", role: "Main", occupation: "Sales Rep", field: "Sales", age: 33, debutSeason: 3, debutYear: 2006 },
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
  { id: "erin-hannon", name: "Erin Hannon", showId: "the-office", gender: "Female", role: "Supporting", occupation: "Receptionist", field: "Administration", age: 25, debutSeason: 5, debutYear: 2009 },
  { id: "holly-flax", name: "Holly Flax", showId: "the-office", gender: "Female", role: "Recurring", occupation: "HR Rep", field: "Human Resources", age: 35, debutSeason: 4, debutYear: 2008 },
  { id: "jan-levinson", name: "Jan Levinson", showId: "the-office", gender: "Female", role: "Recurring", occupation: "Corporate Exec", field: "Management", age: 40, debutSeason: 1 },

  // ------------------------------------------------------- Parks and Recreation
  { id: "leslie-knope", name: "Leslie Knope", showId: "parks-and-rec", gender: "Female", role: "Lead", occupation: "Deputy Director", field: "Government", age: 34, debutSeason: 1 },
  { id: "ron-swanson", name: "Ron Swanson", showId: "parks-and-rec", gender: "Male", role: "Main", occupation: "Parks Director", field: "Government", age: 44, debutSeason: 1 },
  { id: "tom-haverford", name: "Tom Haverford", showId: "parks-and-rec", gender: "Male", role: "Main", occupation: "Parks Admin", field: "Government", age: 29, debutSeason: 1 },
  { id: "april-ludgate", name: "April Ludgate", showId: "parks-and-rec", gender: "Female", role: "Main", occupation: "Intern", field: "Government", age: 20, debutSeason: 1 },
  { id: "andy-dwyer", name: "Andy Dwyer", showId: "parks-and-rec", gender: "Male", role: "Main", occupation: "Musician", field: "Music", age: 28, debutSeason: 1 },
  { id: "ben-wyatt", name: "Ben Wyatt", showId: "parks-and-rec", gender: "Male", role: "Main", occupation: "State Auditor", field: "Government", age: 34, debutSeason: 2, debutYear: 2010 },
  { id: "ann-perkins", name: "Ann Perkins", showId: "parks-and-rec", gender: "Female", role: "Main", occupation: "Nurse", field: "Healthcare", age: 29, debutSeason: 1 },
  { id: "chris-traeger", name: "Chris Traeger", showId: "parks-and-rec", gender: "Male", role: "Main", occupation: "City Manager", field: "Government", age: 43, debutSeason: 2, debutYear: 2010 },
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
  { id: "michael-hitchcock", name: "Michael Hitchcock", showId: "brooklyn-99", gender: "Male", role: "Main", occupation: "Detective", field: "Law Enforcement", age: 62, debutSeason: 1 },
  { id: "norm-scully", name: "Norm Scully", showId: "brooklyn-99", gender: "Male", role: "Main", occupation: "Detective", field: "Law Enforcement", age: 63, debutSeason: 1 },
  { id: "adrian-pimento", name: "Adrian Pimento", showId: "brooklyn-99", gender: "Male", role: "Recurring", occupation: "Detective", field: "Law Enforcement", age: 37, debutSeason: 3, debutYear: 2016 },

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
  { id: "amy-farrah-fowler", name: "Amy Farrah Fowler", showId: "big-bang", gender: "Female", role: "Main", occupation: "Neurobiologist", field: "Science", age: 30, debutSeason: 3, debutYear: 2010 },
  { id: "bernadette-rostenkowski", name: "Bernadette Rostenkowski", showId: "big-bang", gender: "Female", role: "Main", occupation: "Microbiologist", field: "Science", age: 25, debutSeason: 3, debutYear: 2009 },

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
  { id: "frank-reynolds", name: "Frank Reynolds", showId: "always-sunny", gender: "Male", role: "Main", occupation: "Businessman", field: "Business", age: 61, debutSeason: 2, debutYear: 2006 },

  // ------------------------------------------------------------------- 30 Rock
  { id: "liz-lemon", name: "Liz Lemon", showId: "thirty-rock", gender: "Female", role: "Lead", occupation: "Head Writer", field: "Entertainment", age: 36, debutSeason: 1 },
  { id: "jack-donaghy", name: "Jack Donaghy", showId: "thirty-rock", gender: "Male", role: "Main", occupation: "TV Executive", field: "Management", age: 48, debutSeason: 1 },
  { id: "tracy-jordan", name: "Tracy Jordan", showId: "thirty-rock", gender: "Male", role: "Main", occupation: "Actor", field: "Entertainment", age: 38, debutSeason: 1 },
  { id: "jenna-maroney", name: "Jenna Maroney", showId: "thirty-rock", gender: "Female", role: "Main", occupation: "Actress", field: "Entertainment", age: 36, debutSeason: 1 },
  { id: "kenneth-parcell", name: "Kenneth Parcell", showId: "thirty-rock", gender: "Male", role: "Main", occupation: "NBC Page", field: "Entertainment", age: 25, debutSeason: 1 },

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

  // ---------------------------------------------------------------- Superstore
  { id: "amy-sosa", name: "Amy Sosa", showId: "superstore", gender: "Female", role: "Lead", occupation: "Floor Supervisor", field: "Retail", age: 27, debutSeason: 1 },
  { id: "jonah-simms", name: "Jonah Simms", showId: "superstore", gender: "Male", role: "Main", occupation: "Sales Associate", field: "Retail", age: 28, debutSeason: 1 },
  { id: "dina-fox", name: "Dina Fox", showId: "superstore", gender: "Female", role: "Main", occupation: "Assistant Manager", field: "Retail", age: 35, debutSeason: 1 },
  { id: "glenn-sturgis", name: "Glenn Sturgis", showId: "superstore", gender: "Male", role: "Main", occupation: "Store Manager", field: "Retail", age: 55, debutSeason: 1 },
  { id: "garrett-mcneill", name: "Garrett McNeill", showId: "superstore", gender: "Male", role: "Main", occupation: "Announcer", field: "Retail", age: 30, debutSeason: 1 },
  { id: "mateo-liwanag", name: "Mateo Liwanag", showId: "superstore", gender: "Male", role: "Main", occupation: "Sales Associate", field: "Retail", age: 26, debutSeason: 1 },

  // ----------------------------------------------------- Malcolm in the Middle
  { id: "malcolm-wilkerson", name: "Malcolm", showId: "malcolm-middle", gender: "Male", role: "Lead", occupation: "Student", field: "Student", age: 11, debutSeason: 1 },
  { id: "lois-wilkerson", name: "Lois", showId: "malcolm-middle", gender: "Female", role: "Main", occupation: "Store Clerk", field: "Retail", age: 39, debutSeason: 1 },
  { id: "hal-wilkerson", name: "Hal", showId: "malcolm-middle", gender: "Male", role: "Main", occupation: "Office Worker", field: "Business", age: 40, debutSeason: 1 },
  { id: "reese-wilkerson", name: "Reese", showId: "malcolm-middle", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 12, debutSeason: 1 },
  { id: "dewey-wilkerson", name: "Dewey", showId: "malcolm-middle", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 6, debutSeason: 1 },

  // ------------------------------------------------------- Curb Your Enthusiasm
  { id: "larry-david", name: "Larry David", showId: "curb", gender: "Male", role: "Lead", occupation: "TV Producer", field: "Entertainment", age: 53, debutSeason: 1 },
  { id: "cheryl-david", name: "Cheryl David", showId: "curb", gender: "Female", role: "Main", occupation: "Charity Director", field: "Nonprofit", age: 41, debutSeason: 1 },
  { id: "jeff-greene", name: "Jeff Greene", showId: "curb", gender: "Male", role: "Main", occupation: "Talent Manager", field: "Entertainment", age: 46, debutSeason: 1 },
  { id: "susie-greene", name: "Susie Greene", showId: "curb", gender: "Female", role: "Main", occupation: "Homemaker", field: "Homemaker", age: 38, debutSeason: 1 },
  { id: "leon-black", name: "Leon Black", showId: "curb", gender: "Male", role: "Main", occupation: "Entrepreneur", field: "Business", age: 40, debutSeason: 6, debutYear: 2007 },

  // ------------------------------------------------------- Two and a Half Men
  { id: "charlie-harper", name: "Charlie Harper", showId: "two-half-men", gender: "Male", role: "Lead", occupation: "Jingle Writer", field: "Music", age: 37, debutSeason: 1 },
  { id: "alan-harper", name: "Alan Harper", showId: "two-half-men", gender: "Male", role: "Main", occupation: "Chiropractor", field: "Healthcare", age: 35, debutSeason: 1 },
  { id: "jake-harper", name: "Jake Harper", showId: "two-half-men", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 10, debutSeason: 1 },
  { id: "berta", name: "Berta", showId: "two-half-men", gender: "Female", role: "Main", occupation: "Housekeeper", field: "Domestic Service", age: 55, debutSeason: 1 },
  { id: "evelyn-harper", name: "Evelyn Harper", showId: "two-half-men", gender: "Female", role: "Supporting", occupation: "Realtor", field: "Real Estate", age: 65, debutSeason: 1 },

  // ---------------------------------------------------------------------- Veep
  { id: "selina-meyer", name: "Selina Meyer", showId: "veep", gender: "Female", role: "Lead", occupation: "Vice President", field: "Government", age: 45, debutSeason: 1 },
  { id: "amy-brookheimer", name: "Amy Brookheimer", showId: "veep", gender: "Female", role: "Main", occupation: "Chief of Staff", field: "Government", age: 30, debutSeason: 1 },
  { id: "gary-walsh", name: "Gary Walsh", showId: "veep", gender: "Male", role: "Main", occupation: "Personal Aide", field: "Government", age: 35, debutSeason: 1 },
  { id: "dan-egan", name: "Dan Egan", showId: "veep", gender: "Male", role: "Main", occupation: "Political Advisor", field: "Government", age: 31, debutSeason: 1 },
  { id: "jonah-ryan", name: "Jonah Ryan", showId: "veep", gender: "Male", role: "Main", occupation: "White House Liaison", field: "Government", age: 26, debutSeason: 1 },

  // ------------------------------------------------------------ Silicon Valley
  { id: "richard-hendricks", name: "Richard Hendricks", showId: "silicon-valley", gender: "Male", role: "Lead", occupation: "Software Engineer", field: "Technology", age: 26, debutSeason: 1 },
  { id: "erlich-bachman", name: "Erlich Bachman", showId: "silicon-valley", gender: "Male", role: "Main", occupation: "Incubator Owner", field: "Technology", age: 34, debutSeason: 1 },
  { id: "dinesh-chugtai", name: "Dinesh Chugtai", showId: "silicon-valley", gender: "Male", role: "Main", occupation: "Programmer", field: "Technology", age: 25, debutSeason: 1 },
  { id: "bertram-gilfoyle", name: "Bertram Gilfoyle", showId: "silicon-valley", gender: "Male", role: "Main", occupation: "Systems Architect", field: "Technology", age: 28, debutSeason: 1 },
  { id: "jared-dunn", name: "Jared Dunn", showId: "silicon-valley", gender: "Male", role: "Main", occupation: "Business Developer", field: "Business", age: 30, debutSeason: 1 },

  // ---------------------------------------------------------------- black-ish
  { id: "andre-johnson", name: "Andre Johnson", showId: "black-ish", gender: "Male", role: "Lead", occupation: "Ad Executive", field: "Marketing", age: 40, debutSeason: 1 },
  { id: "rainbow-johnson", name: "Rainbow Johnson", showId: "black-ish", gender: "Female", role: "Main", occupation: "Anesthesiologist", field: "Healthcare", age: 39, debutSeason: 1 },
  { id: "zoey-johnson", name: "Zoey Johnson", showId: "black-ish", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 14, debutSeason: 1 },
  { id: "andre-johnson-jr", name: "Andre Johnson Jr.", showId: "black-ish", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 13, debutSeason: 1 },
  { id: "ruby-johnson", name: "Ruby Johnson", showId: "black-ish", gender: "Female", role: "Supporting", occupation: "Retired", field: "Unemployed", age: 65, debutSeason: 1 },

  // ------------------------------------------------------------- Schitt's Creek
  { id: "johnny-rose", name: "Johnny Rose", showId: "schitts-creek", gender: "Male", role: "Lead", occupation: "Businessman", field: "Business", age: 60, debutSeason: 1 },
  { id: "moira-rose", name: "Moira Rose", showId: "schitts-creek", gender: "Female", role: "Main", occupation: "Actress", field: "Entertainment", age: 58, debutSeason: 1 },
  { id: "david-rose", name: "David Rose", showId: "schitts-creek", gender: "Male", role: "Main", occupation: "Store Owner", field: "Retail", age: 30, debutSeason: 1 },
  { id: "alexis-rose", name: "Alexis Rose", showId: "schitts-creek", gender: "Female", role: "Main", occupation: "Publicist", field: "Marketing", age: 27, debutSeason: 1 },
  { id: "stevie-budd", name: "Stevie Budd", showId: "schitts-creek", gender: "Female", role: "Main", occupation: "Motel Clerk", field: "Hospitality", age: 27, debutSeason: 1 },

  // ------------------------------------------------------------ The Good Place
  { id: "eleanor-shellstrop", name: "Eleanor Shellstrop", showId: "good-place", gender: "Female", role: "Lead", occupation: "Saleswoman", field: "Sales", age: 34, debutSeason: 1 },
  { id: "chidi-anagonye", name: "Chidi Anagonye", showId: "good-place", gender: "Male", role: "Main", occupation: "Ethics Professor", field: "Education", age: 35, debutSeason: 1 },
  { id: "tahani-al-jamil", name: "Tahani Al-Jamil", showId: "good-place", gender: "Female", role: "Main", occupation: "Philanthropist", field: "Nonprofit", age: 33, debutSeason: 1 },
  { id: "jason-mendoza", name: "Jason Mendoza", showId: "good-place", gender: "Male", role: "Main", occupation: "DJ", field: "Music", age: 26, debutSeason: 1 },
  { id: "michael-good-place", name: "Michael", showId: "good-place", gender: "Male", role: "Main", occupation: "Architect", field: "Afterlife", age: 58, debutSeason: 1 },

  // -------------------------------------------------------- Kim's Convenience
  { id: "appa-kim", name: "Mr. Kim", showId: "kims-convenience", gender: "Male", role: "Lead", occupation: "Store Owner", field: "Retail", age: 56, debutSeason: 1 },
  { id: "umma-kim", name: "Mrs. Kim", showId: "kims-convenience", gender: "Female", role: "Main", occupation: "Store Owner", field: "Retail", age: 54, debutSeason: 1 },
  { id: "janet-kim", name: "Janet Kim", showId: "kims-convenience", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 20, debutSeason: 1 },
  { id: "jung-kim", name: "Jung Kim", showId: "kims-convenience", gender: "Male", role: "Main", occupation: "Car Rental Manager", field: "Retail", age: 24, debutSeason: 1 },
  { id: "kimchee-han", name: "Kimchee Han", showId: "kims-convenience", gender: "Male", role: "Main", occupation: "Car Rental Manager", field: "Retail", age: 25, debutSeason: 1 },
  { id: "shannon-ross", name: "Shannon Ross", showId: "kims-convenience", gender: "Female", role: "Supporting", occupation: "Branch Manager", field: "Management", age: 28, debutSeason: 1 },

  // --------------------------------------------------------------- Derry Girls
  { id: "erin-quinn", name: "Erin Quinn", showId: "derry-girls", gender: "Female", role: "Lead", occupation: "Student", field: "Student", age: 16, debutSeason: 1 },
  { id: "orla-mccool", name: "Orla McCool", showId: "derry-girls", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 15, debutSeason: 1 },
  { id: "clare-devlin", name: "Clare Devlin", showId: "derry-girls", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 16, debutSeason: 1 },
  { id: "michelle-mallon", name: "Michelle Mallon", showId: "derry-girls", gender: "Female", role: "Main", occupation: "Student", field: "Student", age: 16, debutSeason: 1 },
  { id: "james-maguire", name: "James Maguire", showId: "derry-girls", gender: "Male", role: "Main", occupation: "Student", field: "Student", age: 16, debutSeason: 1 },
  { id: "sister-michael", name: "Sister Michael", showId: "derry-girls", gender: "Female", role: "Supporting", occupation: "Headmistress", field: "Education", age: 50, debutSeason: 1 },

  // ----------------------------------------------- What We Do in the Shadows
  { id: "nandor", name: "Nandor the Relentless", showId: "wwdits", gender: "Male", role: "Lead", occupation: "Vampire", field: "Supernatural", age: 760, debutSeason: 1 },
  { id: "laszlo-cravensworth", name: "Laszlo Cravensworth", showId: "wwdits", gender: "Male", role: "Main", occupation: "Vampire", field: "Supernatural", age: 310, debutSeason: 1 },
  { id: "nadja-antipaxos", name: "Nadja", showId: "wwdits", gender: "Female", role: "Main", occupation: "Vampire", field: "Supernatural", age: 500, debutSeason: 1 },
  { id: "guillermo-de-la-cruz", name: "Guillermo de la Cruz", showId: "wwdits", gender: "Male", role: "Main", occupation: "Familiar", field: "Domestic Service", age: 28, debutSeason: 1 },
  { id: "colin-robinson", name: "Colin Robinson", showId: "wwdits", gender: "Male", role: "Main", occupation: "Office Worker", field: "Business", age: 100, debutSeason: 1 },

  // ---------------------------------------------------------------- Ted Lasso
  { id: "ted-lasso", name: "Ted Lasso", showId: "ted-lasso", gender: "Male", role: "Lead", occupation: "Football Coach", field: "Sports", age: 45, debutSeason: 1 },
  { id: "rebecca-welton", name: "Rebecca Welton", showId: "ted-lasso", gender: "Female", role: "Main", occupation: "Club Owner", field: "Sports", age: 47, debutSeason: 1 },
  { id: "roy-kent", name: "Roy Kent", showId: "ted-lasso", gender: "Male", role: "Main", occupation: "Footballer", field: "Sports", age: 38, debutSeason: 1 },
  { id: "keeley-jones", name: "Keeley Jones", showId: "ted-lasso", gender: "Female", role: "Main", occupation: "PR Manager", field: "Marketing", age: 30, debutSeason: 1 },
  { id: "jamie-tartt", name: "Jamie Tartt", showId: "ted-lasso", gender: "Male", role: "Main", occupation: "Footballer", field: "Sports", age: 23, debutSeason: 1 },

  // --------------------------------------------------------- Abbott Elementary
  { id: "janine-teagues", name: "Janine Teagues", showId: "abbott", gender: "Female", role: "Lead", occupation: "Teacher", field: "Education", age: 25, debutSeason: 1 },
  { id: "gregory-eddie", name: "Gregory Eddie", showId: "abbott", gender: "Male", role: "Main", occupation: "Substitute Teacher", field: "Education", age: 28, debutSeason: 1 },
  { id: "ava-coleman", name: "Ava Coleman", showId: "abbott", gender: "Female", role: "Main", occupation: "Principal", field: "Education", age: 38, debutSeason: 1 },
  { id: "barbara-howard", name: "Barbara Howard", showId: "abbott", gender: "Female", role: "Main", occupation: "Teacher", field: "Education", age: 55, debutSeason: 1 },
  { id: "melissa-schemmenti", name: "Melissa Schemmenti", showId: "abbott", gender: "Female", role: "Main", occupation: "Teacher", field: "Education", age: 50, debutSeason: 1 },
  { id: "jacob-hill", name: "Jacob Hill", showId: "abbott", gender: "Male", role: "Main", occupation: "Teacher", field: "Education", age: 30, debutSeason: 1 },

  // --------------------------------------------------------------------- Hacks
  { id: "deborah-vance", name: "Deborah Vance", showId: "hacks", gender: "Female", role: "Lead", occupation: "Comedian", field: "Entertainment", age: 69, debutSeason: 1 },
  { id: "ava-daniels", name: "Ava Daniels", showId: "hacks", gender: "Female", role: "Main", occupation: "Comedy Writer", field: "Entertainment", age: 25, debutSeason: 1 },
  { id: "marcus-hacks", name: "Marcus", showId: "hacks", gender: "Male", role: "Main", occupation: "CEO", field: "Management", age: 41, debutSeason: 1 },
  { id: "jimmy-lusak", name: "Jimmy LuSak", showId: "hacks", gender: "Male", role: "Main", occupation: "Talent Manager", field: "Entertainment", age: 32, debutSeason: 1 },
  { id: "kayla-schaefer", name: "Kayla Schaefer", showId: "hacks", gender: "Female", role: "Supporting", occupation: "Talent Agent", field: "Entertainment", age: 25, debutSeason: 1 },

  // ---------------------------------------------------- Recurring fan favorites
  { id: "david-wallace", name: "David Wallace", showId: "the-office", gender: "Male", role: "Recurring", occupation: "CFO", field: "Management", age: 45, debutSeason: 2, debutYear: 2006 },
  { id: "todd-packer", name: "Todd Packer", showId: "the-office", gender: "Male", role: "Recurring", occupation: "Sales Rep", field: "Sales", age: 43, debutSeason: 1, debutYear: 2005 },
  { id: "tammy-swanson", name: "Tammy Swanson", showId: "parks-and-rec", gender: "Female", role: "Recurring", occupation: "Librarian", field: "Government", age: 42, debutSeason: 2, debutYear: 2009 },
  { id: "jean-ralphio", name: "Jean-Ralphio Saperstein", showId: "parks-and-rec", gender: "Male", role: "Recurring", occupation: "Entrepreneur", field: "Business", age: 25, debutSeason: 2, debutYear: 2010 },
  { id: "doug-judy", name: "Doug Judy", showId: "brooklyn-99", gender: "Male", role: "Recurring", occupation: "Car Thief", field: "Crime", age: 34, debutSeason: 1, debutYear: 2014 },
  { id: "kevin-cozner", name: "Kevin Cozner", showId: "brooklyn-99", gender: "Male", role: "Recurring", occupation: "Professor", field: "Education", age: 48, debutSeason: 1, debutYear: 2014 },
  { id: "ranjit", name: "Ranjit Singh", showId: "himym", gender: "Male", role: "Recurring", occupation: "Driver", field: "Transportation", age: 42, debutSeason: 1, debutYear: 2005 },
  { id: "stuart-bloom", name: "Stuart Bloom", showId: "big-bang", gender: "Male", role: "Recurring", occupation: "Comic Shop Owner", field: "Retail", age: 34, debutSeason: 2, debutYear: 2008 },
  { id: "wil-wheaton", name: "Wil Wheaton", showId: "big-bang", gender: "Male", role: "Recurring", occupation: "Actor", field: "Entertainment", age: 37, debutSeason: 3, debutYear: 2009 },
  { id: "magnitude", name: "Magnitude", showId: "community", gender: "Male", role: "Recurring", occupation: "Student", field: "Student", age: 18, debutSeason: 2, debutYear: 2011 },
  { id: "dylan-marshall", name: "Dylan Marshall", showId: "modern-family", gender: "Male", role: "Recurring", occupation: "Musician", field: "Music", age: 18, debutSeason: 1, debutYear: 2009 },

  // ---------------------------------------------------------------- House M.D.
  { id: "gregory-house", name: "Gregory House", showId: "house-md", gender: "Male", role: "Lead", occupation: "Diagnostician", field: "Healthcare", age: 45, debutSeason: 1, debutYear: 2004 },
  { id: "james-wilson", name: "James Wilson", showId: "house-md", gender: "Male", role: "Main", occupation: "Oncologist", field: "Healthcare", age: 35, debutSeason: 1, debutYear: 2004 },
  { id: "lisa-cuddy", name: "Lisa Cuddy", showId: "house-md", gender: "Female", role: "Main", occupation: "Hospital Dean", field: "Management", age: 36, debutSeason: 1, debutYear: 2004 },
  { id: "eric-foreman", name: "Eric Foreman", showId: "house-md", gender: "Male", role: "Main", occupation: "Neurologist", field: "Healthcare", age: 30, debutSeason: 1, debutYear: 2004 },
  { id: "robert-chase", name: "Robert Chase", showId: "house-md", gender: "Male", role: "Main", occupation: "Doctor", field: "Healthcare", age: 30, debutSeason: 1, debutYear: 2004 },
  { id: "allison-cameron", name: "Allison Cameron", showId: "house-md", gender: "Female", role: "Main", occupation: "Immunologist", field: "Healthcare", age: 25, debutSeason: 1, debutYear: 2004 },
  { id: "stacy-warner", name: "Stacy Warner", showId: "house-md", gender: "Female", role: "Recurring", occupation: "Lawyer", field: "Law", age: 38, debutSeason: 1, debutYear: 2005 },
  { id: "amber-volakis", name: "Amber Volakis", showId: "house-md", gender: "Female", role: "Recurring", occupation: "Doctor", field: "Healthcare", age: 32, debutSeason: 4, debutYear: 2007 },

  // ---------------------------------------------------------------------- Lost
  { id: "jack-shephard", name: "Jack Shephard", showId: "lost", gender: "Male", role: "Lead", occupation: "Surgeon", field: "Healthcare", age: 34, debutSeason: 1, debutYear: 2004 },
  { id: "kate-austen", name: "Kate Austen", showId: "lost", gender: "Female", role: "Main", occupation: "Fugitive", field: "Crime", age: 27, debutSeason: 1, debutYear: 2004 },
  { id: "james-sawyer-ford", name: "James 'Sawyer' Ford", showId: "lost", gender: "Male", role: "Main", occupation: "Con Artist", field: "Crime", age: 35, debutSeason: 1, debutYear: 2004 },
  { id: "john-locke", name: "John Locke", showId: "lost", gender: "Male", role: "Main", occupation: "Office Worker", field: "Business", age: 48, debutSeason: 1, debutYear: 2004 },
  { id: "hugo-reyes", name: "Hugo Reyes", showId: "lost", gender: "Male", role: "Main", occupation: "Lottery Winner", field: "Unemployed", age: 26, debutSeason: 1, debutYear: 2004 },
  { id: "sayid-jarrah", name: "Sayid Jarrah", showId: "lost", gender: "Male", role: "Main", occupation: "Comms Officer", field: "Military", age: 37, debutSeason: 1, debutYear: 2004 },
  { id: "desmond-hume", name: "Desmond Hume", showId: "lost", gender: "Male", role: "Supporting", occupation: "Sailor", field: "Transportation", age: 35, debutSeason: 2, debutYear: 2005 },
  { id: "benjamin-linus", name: "Benjamin Linus", showId: "lost", gender: "Male", role: "Supporting", occupation: "Community Leader", field: "Management", age: 42, debutSeason: 2, debutYear: 2006 },

  // --------------------------------------------------------------- Supernatural
  { id: "dean-winchester", name: "Dean Winchester", showId: "supernatural", gender: "Male", role: "Lead", occupation: "Hunter", field: "Supernatural", age: 26, debutSeason: 1, debutYear: 2005 },
  { id: "sam-winchester", name: "Sam Winchester", showId: "supernatural", gender: "Male", role: "Lead", occupation: "Hunter", field: "Supernatural", age: 22, debutSeason: 1, debutYear: 2005 },
  { id: "bobby-singer", name: "Bobby Singer", showId: "supernatural", gender: "Male", role: "Supporting", occupation: "Hunter", field: "Supernatural", age: 56, debutSeason: 1, debutYear: 2006 },
  { id: "castiel", name: "Castiel", showId: "supernatural", gender: "Male", role: "Main", occupation: "Angel", field: "Supernatural", age: 35, debutSeason: 4, debutYear: 2008 },
  { id: "crowley", name: "Crowley", showId: "supernatural", gender: "Male", role: "Recurring", occupation: "Demon", field: "Supernatural", age: 50, debutSeason: 5, debutYear: 2009 },
  { id: "rowena-macleod", name: "Rowena MacLeod", showId: "supernatural", gender: "Female", role: "Recurring", occupation: "Witch", field: "Supernatural", age: 300, debutSeason: 10, debutYear: 2014 },
  { id: "charlie-bradbury", name: "Charlie Bradbury", showId: "supernatural", gender: "Female", role: "Recurring", occupation: "Hacker", field: "Technology", age: 26, debutSeason: 7, debutYear: 2012 },
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
    debutYear: seed.debutYear ?? show.premiere + seed.debutSeason - 1,
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
