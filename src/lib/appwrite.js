import { Client, Query, Databases } from 'appwrite';

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('672e520700127c691dc9');

const databases = new Databases(client);
const TOTAL_DOCUMENT_COUNT = 7276;

export const fetchRandomGame = async () => {
  try {
    // Generate a random offset within the total document count
    const randomOffset = Math.floor(Math.random() * TOTAL_DOCUMENT_COUNT);

    // Fetch one document at the random offset
    const response = await databases.listDocuments(
     '672e683c001beba0b2a6',
     '672e685b0006682c0049',
     [
      Query.limit(1),      // Limit to 1 document
      Query.offset(randomOffset) // Use random offset
    ]
    );

    // Ensure we got a document back
    if (response.documents.length === 0) {
      throw new Error('No document found at the random offset');
    }

    const randomGame = response.documents[0];
    return randomGame;
  } catch (error) {
    console.error('Error fetching random game:', error);
    throw error;
  }
};
