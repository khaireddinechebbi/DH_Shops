import Navbar from "@/components/Navbar";


export default function Orders() {
  return (
    <>
    <Navbar/>
    <form action="/api/upload" method="POST" encType="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>

    </>
  )
}
