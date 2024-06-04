import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.productivityhobbist.aora',
  projectId: "665d3cb9003e4502b1bb",
  databaseId: '665d3e1f001b191b5958',
  userCollectionId: '665d3e38002906a5cf35',
  videoCollectionId: '665d3e55001527e72192',
  storageId: '665d3f5f0033cc9c6eba',
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = appwriteConfig;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.

  const account = new Account(client);
  const avatars = new Avatars(client);
  const databases = new Databases(client);

export const createUser = async (email:string, password:string, username:string) => {
  // Register User
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    if (!newAccount) throw Error;
    
    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email, 
        username,
        avatar: avatarUrl
      }
    )

    return newUser

  } catch (error:any) {
    console.log(error);
    throw new Error(String(error))
  }
}

export const signIn = async (email:string, password:string) => {
  // Sign in User
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session
    
  } catch (error) {
    throw new Error(String(error))
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    )

    return posts.documents;
  } catch (error) {
    throw new Error(String(error))
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )

    return posts.documents;
  } catch (error) {
    throw new Error(String(error))
  }
}