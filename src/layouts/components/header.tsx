import { Droplets } from "lucide-react"

function Header() {
  return (
    <header className="border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h1 className="font-bold text-xl">Water Quality Monitor</h1>
        </div>
      </div>
    </header>
  )
}

export default Header