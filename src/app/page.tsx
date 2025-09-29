import { SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
export default async function Home() {
 return (
 <div>
       <Button>Hello World !</Button>
       <Button><SignOutButton/></Button>
    </div>)
}
