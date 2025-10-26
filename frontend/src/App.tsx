import { Button } from "./componenets/Button"
import { PlusIcon } from "./icons/PlusIcon"
import { ShareIcon } from "./icons/ShareIcon"

function App() {

  return (
    <div className="flex gap-1">
      <Button startIcon={<ShareIcon size={"md"} />} variant="primary" size="sm" text={"Share Brain"} />
      <Button startIcon={<PlusIcon size={"md"} />} variant="secondary" size="sm" text={"Add Content"} />
    </div>
  )
}

export default App
