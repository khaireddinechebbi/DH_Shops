import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Profile() {
  return (
    <>
      <Navbar/>
      <div>Profile</div>
      <Link href="/addProduct">
        <button>Add Product</button>
      </Link>
    </>
  )
}
