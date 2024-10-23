import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default  function Header() {
    return (
        <div className="border-b py-4 bg-gray-50"  >
            <div className=" items-center container mx-auto justify-between flex" >
                <div className="font-bold">FileDrive</div>
                <div className="flex gap-2">

                <OrganizationSwitcher/>
                <UserButton/>
               
                </div>
                
            </div>
        </div>
    )
}