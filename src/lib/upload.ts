import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

// Upload files to Firebase Storage under `folder`, reporting combined progress (0–100).
// Resolves with the download URLs in the same order as `files`.
export async function uploadFiles(
  folder: string,
  files: File[],
  onProgress?: (percent: number) => void
): Promise<string[]> {
  const total = files.reduce((sum, file) => sum + file.size, 0) || 1
  const sent = files.map(() => 0)
  const report = () => onProgress?.(Math.round((sent.reduce((a, b) => a + b, 0) / total) * 100))

  report()
  return Promise.all(
    files.map(
      (file, i) =>
        new Promise<string>((resolve, reject) => {
          const ref = storageRef(storage, `${folder}/${Date.now()}-${i}-${file.name}`)
          const task = uploadBytesResumable(ref, file, { contentType: file.type })
          task.on(
            "state_changed",
            (snapshot) => {
              sent[i] = snapshot.bytesTransferred
              report()
            },
            reject,
            () => getDownloadURL(task.snapshot.ref).then(resolve, reject)
          )
        })
    )
  )
}
