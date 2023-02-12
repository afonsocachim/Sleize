export const blobToDataURL = (
  blob: Blob,
  callback: (n: string | ArrayBuffer | null) => void
) => {
  const a = new FileReader();
  a.onload = (e) => {
    callback(e.target ? e.target.result : null);
  };
  a.readAsDataURL(blob);
};
