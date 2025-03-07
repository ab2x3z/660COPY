import { useState } from "react";
import tomHankImage from "../../assets/tom-hanks.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const UserProfile = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <button onClick={openDialog} className="bg-blue-500 p-2 rounded text-white">
        Open Profile
      </button>
      {isDialogOpen && (
        <Dialog onClose={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
            </DialogHeader>
            <DialogContent>
              <img src={tomHankImage} alt="Tom Hanks" className="w-full h-auto rounded mb-4" />
              <DialogDescription>
                <p>Name: Tom Hanks</p>
                <p>Email: tom.hanks@example.com</p>
              </DialogDescription>
            </DialogContent>
            <DialogFooter>
              <button onClick={closeDialog} className="bg-red-500 p-2 rounded text-white">
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserProfile;
