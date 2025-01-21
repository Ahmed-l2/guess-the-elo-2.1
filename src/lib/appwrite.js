import { Client, Functions, Databases} from 'appwrite';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('672e520700127c691dc9');

// Initialize Appwrite Functions service
const functions = new Functions(client);
const databases = new Databases(client);
export const fetchRandomGame = async () => {
  try {

    // Call the Cloud Function to get the filtered game data
    const response = await functions.createExecution(
      '6734e194003198613988',  // ID of your Cloud Function
    );

    // Parse the response payload from the Cloud Function
    const result = JSON.parse(response.responseBody);
    console.log(result);

    // Check if the response contains an error
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('Error fetching random game:', error);
    throw error;
  }
};

export const fetchGameDetails = async (gameId) => {
  try {
    // Call the Cloud Function to get the game details
    const response = await functions.createExecution(
      '6734efad003a8936478f',  // Replace with the actual ID of your Cloud Function
      JSON.stringify({ gameId })
    );

    // Parse and handle the response
    const gameDetails = JSON.parse(response.responseBody);

    // Check if there is an error in the response
    if (gameDetails.error) {
      throw new Error(gameDetails.error);
    }

    return gameDetails;
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};
export { databases, client, functions };
