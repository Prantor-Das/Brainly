import { ButtonUI } from "./componenets/Button";
import { Card } from "./componenets/Card/Card";
// import Modal from "./componenets/Modal";
import { PlusIcon } from "./icons/PlusIcon";
import { ShareIcon } from "./icons/ShareIcon";

function App() {
  return (
    <>
      <ButtonUI
        startIcon={<ShareIcon size={"md"} />}
        variant="primary"
        size="sm"
        text={"Share Brain"}
      />
      <ButtonUI
        startIcon={<PlusIcon size={"md"} />}
        variant="secondary"
        size="sm"
        text={"Add Content"}
      />
      {/* <Modal onClick={() => {}} setModal={() => {}} setReloadData={() => {}} /> */}
      <Card icon="Youtube" tag="Productivity" title="Title" link="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
    </>
  );
}

export default App;
