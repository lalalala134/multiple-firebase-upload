import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAj8U2c-rOWz9zFcfnSWg7qFNjapEa4vZ0",
  authDomain: "newstart-c3e46.firebaseapp.com",
  projectId: "newstart-c3e46",
  storageBucket: "newstart-c3e46.appspot.com",
  messagingSenderId: "315639909401",
  appId: "1:315639909401:web:24da76147357b0c3972e88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();

// methods
export const uploadFile = (
  file: File,
  updateCb: (snapshot: UploadTaskSnapshot) => void = () => false
): Promise<string> => {
  const path = `Español/${file.name}`;
  console.log(file);
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return new Promise((res, rej) => {
    return uploadTask.on(
      "state_changed",
      updateCb,
      () => rej(null),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
          res(downloadURL);
        });
      }
    );
  });
};
