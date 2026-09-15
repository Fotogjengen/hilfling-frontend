import { Dialog } from "@/components/ui/overlay/Dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/navigation/Tabs";
import InternalLoginForm from "./InternalLoginForm";
import ExternalLoginForm from "./ExternalLoginForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginPopUp = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Logg inn">
      <Tabs defaultValue="intern">
        <TabsList>
          <TabsTrigger value="intern">Intern</TabsTrigger>
          <TabsTrigger value="ekstern">Ekstern</TabsTrigger>
        </TabsList>
        <TabsContent value="intern">
          <InternalLoginForm onSuccess={() => onOpenChange(false)} />
        </TabsContent>
        <TabsContent value="ekstern">
          <ExternalLoginForm onSuccess={() => onOpenChange(false)} />
        </TabsContent>
      </Tabs>
    </Dialog>
  );
};

export default LoginPopUp;
