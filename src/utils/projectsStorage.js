import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "../firebase/config";

const COLLECTION = "projects";

const mapDoc = (snapshot) => ({
  id: snapshot.id,
  ...snapshot.data(),
  tags: snapshot.data().tags ?? [],
});

const getCreatedAtMs = (createdAt) => {
  if (!createdAt) return 0;
  if (typeof createdAt.toMillis === "function") return createdAt.toMillis();
  if (createdAt.seconds) return createdAt.seconds * 1000;
  return 0;
};

const sortByCreatedAt = (projects) =>
  [...projects].sort(
    (a, b) => getCreatedAtMs(b.createdAt) - getCreatedAtMs(a.createdAt)
  );

export const fetchProjects = async () => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return sortByCreatedAt(snapshot.docs.map(mapDoc));
};

export const addProject = async ({
  name,
  description,
  source_code_link,
  website_link,
  imageFile,
  tags = [],
}) => {
  let imageUrl = "";

  if (imageFile) {
    const fileRef = ref(storage, `projects/${Date.now()}-${imageFile.name}`);
    await uploadBytes(fileRef, imageFile);
    imageUrl = await getDownloadURL(fileRef);
  }

  const docRef = await addDoc(collection(db, COLLECTION), {
    name,
    description,
    source_code_link,
    website_link: website_link ?? "",
    image: imageUrl,
    tags,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    name,
    description,
    source_code_link,
    website_link: website_link ?? "",
    image: imageUrl,
    tags,
  };
};
