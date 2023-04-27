import { UploadTaskSnapshot } from "firebase/storage";
import React, { useState } from "react";
import { uploadFile } from "./firebase";
import "./styles.css";

type UploadObjectType = {
  preview: string;
  progress?: number;
};

type StatusObjectType = {
  [key: string]: UploadObjectType;
};

export default function App() {
  const [links, setLinks] = useState<string[]>([]);
  const loading = useState<boolean>(false);
  const [statusObject, setStatusObject] = useState<StatusObjectType>({});

  const getPreview = (file: File): Promise<string | ArrayBuffer | null> => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    return new Promise((res, rej) => {
      fileReader.onload = () => {
        res(fileReader.result);
      };
    });
  };

  const onUpdateUpload = async (
    snapshot: UploadTaskSnapshot,
    filename: string
  ) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setStatusObject((ob) => ({
      ...ob,
      [filename]: { ...ob[filename], progress }
    }));
  };

  // part 2
  const handleMultiple = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files || !evt.target.files.length) return;
    const files = Array.from(evt.target.files);
    const objects: StatusObjectType = {};
    for (let file of files) {
      const preview = (await getPreview(file)) as string;
      objects[file.name] = { preview };
    }
    setStatusObject(objects);
    const promises = files.map((file) => {
      return uploadFile(file, (snapshot) =>
        onUpdateUpload(snapshot, file.name)
      );
    });
    const ls = await Promise.all(promises);
    setLinks(ls);
  };

  // part 1

  return (
    <div className="App">
      <h1>Upload files</h1>
      <h2>Start with one:</h2>
      <input
        accept="audio/mp3"
        multiple
        onChange={handleMultiple}
        type="file"
      />
      <h3>Links:</h3>
      <ul>
        {links.map((li) => (
          <li key={li}>{li}</li>
        ))}
      </ul>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {Object.values(statusObject).map((ob) => {
          return (
            <div>
              <img
                width="180"
                src={ob.preview}
                key={ob.preview}
                alt="preview"
              />
              <p>{ob.progress}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
