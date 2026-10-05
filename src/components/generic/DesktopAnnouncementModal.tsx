import { useEffect, useRef, useState } from "react";
import {
  ArrowTopRightOnSquareIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

const DISMISSED_KEY = "joker-forge-desktop-announcement-dismissed";
const DESKTOP_URL = "https://github.com/Jaydchw/joker-forge-desktop";

const DesktopAnnouncementModal = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(DISMISSED_KEY) !== "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    confirmButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch (error) {
      console.warn("Could not remember the desktop announcement dismissal:", error);
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="desktop-announcement-title"
      aria-describedby="desktop-announcement-description"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      className="m-auto w-[calc(100%_-_2rem)] max-w-lg max-h-[calc(100dvh_-_2rem)] overflow-y-auto rounded-xl border-2 border-black-lighter bg-black-dark p-0 text-white-light shadow-2xl font-lexend backdrop:bg-black-darker/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-black-lighter/50 bg-black-darker px-6 py-5">
        <div className="shrink-0 rounded-lg bg-mint/20 p-2">
          <ComputerDesktopIcon className="h-6 w-6 text-mint-light" aria-hidden="true" />
        </div>
        <h2 id="desktop-announcement-title" className="text-xl font-medium">
          Meet JokerForge Desktop
        </h2>
      </div>

      <div id="desktop-announcement-description" className="space-y-3 px-6 py-5 leading-relaxed">
        <p>
          Nightly releases of JokerForge desktop are available!
          Create and manage your Balatro mod content from an improved, dedicated app on your computer.
        </p>
        <p className="text-sm text-white-darker">
          Downloads are available on Github. This message won&apos;t appear again.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-black-lighter/50 bg-black-darker/30 px-6 py-4 sm:flex-row sm:justify-end">
        <a
          href={DESKTOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="flex items-center justify-center gap-2 rounded-lg bg-black-lighter px-4 py-3 text-sm text-white-light transition-colors hover:bg-black-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
        >
          View JokerForge Desktop
          <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
        <button
          ref={confirmButtonRef}
          type="button"
          onClick={dismiss}
          className="cursor-pointer rounded-lg bg-mint px-6 py-3 font-medium text-black-dark transition-colors hover:bg-mint-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
        >
          Got it
        </button>
      </div>
    </dialog>
  );
};

export default DesktopAnnouncementModal;
