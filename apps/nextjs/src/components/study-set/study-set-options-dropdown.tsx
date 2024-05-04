"use client";

import { useRef, useState } from "react";
import {
  DownloadIcon,
  Ellipsis,
  MergeIcon,
  PrinterIcon,
  Trash2Icon,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { api } from "~/trpc/react";
import DeleteStudySetDialog from "./delete-study-set-dialog";
import StudySetToPrint from "./study-set-to-print";

const StudySetOptionsDropdown = ({
  isOwner,
  id,
}: {
  isOwner: boolean;
  id: string;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const utils = api.useUtils();
  const studySet = utils.studySet.byId.getData({ id });
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    fonts: [
      {
        family: "Inter",
        source:
          "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
      },
    ],
  });

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Ellipsis size={16} />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>More</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isOwner && (
            <DropdownMenuItem>
              <MergeIcon size={16} className="mr-2" />
              Combine
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handlePrint}>
            <PrinterIcon size={16} className="mr-2" />
            Print
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon size={16} className="mr-2" /> Export
          </DropdownMenuItem>
          {isOwner && (
            <DropdownMenuItem onClick={openDeleteDialog}>
              <Trash2Icon size={16} className="mr-2" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {isOwner && (
        <DeleteStudySetDialog
          id={id}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
      {studySet && <StudySetToPrint ref={printRef} studySet={studySet} />}
    </>
  );
};

export default StudySetOptionsDropdown;