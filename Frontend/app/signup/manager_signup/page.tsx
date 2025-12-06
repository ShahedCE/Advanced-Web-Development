import Link from "next/link";


export default function ManagerSignup(){

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-200">  {/*flex*/} 

      <div className="bg-white p-6 rounded-2xl w-full max-w-md"> {/**/} 
        <h2 className="text-2xl font-bold text-center mb-6">Manager Sign Up</h2>

        <form  className="space-y-3">

          <div>
            <label htmlFor="fullname" className="block text-m"> Fullname: </label>
            <input type="text" id="fullname" name="fullname"  className="w-full px-3 py-2 border rounded-lg font-medium"/>
          </div>

          <div>
            <label htmlFor="email" className="block text-m"> Email: </label>
            <input type="email" id="email" name="email" className="w-full px-3 py-2 border rounded-lg " />
          </div>

          <div>
            <label htmlFor="password" className="block text-m font-medium">  Password:  </label>
            <input type="password" id="password" name="password"  className="w-full px-3 py-2 border rounded-lg  " />
          </div>

          <div>
            <label htmlFor="age" className="block text-m font-medium">Age: </label>
            <input type="number"  id="age"  name="age" className="w-medium px-3 py-2 border rounded-lg  " />
          </div>

          <div>
            <label htmlFor="file" className=" text-m font-medium">Profile picture: </label>
            <input type="file" id="file" name="file" className=" px-3 py-2 border rounded-lg" />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white mt-8 py-2 rounded-lg hover:bg-green-700"> Sign Up  </button>

        </form>

        <p className="text-m text-center mt-4"> Already have an account?{" "}
          <Link href="/login/manager_login" className="text-blue-600 hover:underline"> Login </Link>
        </p>

      </div>

    </div>
  );

}