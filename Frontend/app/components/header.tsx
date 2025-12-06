import Image from "next/image"
import Link from "next/link";
export default function MyHeader(){

    return (
        <>

       <div className="bg-indigo-100">    
        <Image
        src="/logo2.jpeg"
        alt="Logo"
        width={120}
        height={100}
       />
       </div>  
      <h1 className="bg-indigo-200"> Doctor Laoundry Service </h1>
    


       <ul className="flex space-x-8 bg-white-400 bg-indigo-400" >
  <li>
   
    <Link href="/" className=" m-1 bg-indigo-400">Home</Link>
    
  </li>
  <li>
    <Link href="/about">About</Link>
  </li>
  <li>
    <Link href="/login/admin_login"> Admin Login</Link>
  </li>
  <li>
    <Link href="/signup/admin_signup">Admin Signup</Link>
  </li>
  
</ul>
       
</>
   );

     
}