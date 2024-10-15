import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import UserProducts from "@/components/UserProducts";


export default function Profile() {
  return (
    <>
    <Navbar/>
    <div>Profile</div>
    <ProductForm/>
    <UserProducts/>
    </>
  )
}
