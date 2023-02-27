import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PlusIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import ProfileImage from "../ProfileImage";
import Image from "next/image";
import { useAuthDropdownContext } from "../../contexts/AuthDropdownContext";

interface NavbarProps {
  openMobileMenu: () => void;
  openCreateFolder: () => void;
}

const Navbar = ({ openMobileMenu, openCreateFolder }: NavbarProps) => {
  const { data: session } = useSession();
  const [menuDropdownOpen, setMenuDropdownOpen] = useState<boolean>(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState<boolean>(false);
  const { push, pathname } = useRouter();
  const [state, dispatch] = useAuthDropdownContext();

  useEffect(() => {
    setMenuDropdownOpen(false);
    setCreateDropdownOpen(false);
  }, [pathname]);

  const toggleMenuDropdown = () => {
    setMenuDropdownOpen((prev) => !prev);
  };

  const toggleCreateDropdown = () => {
    setCreateDropdownOpen((prev) => !prev);
  };

  const handleCreateFolder = () => {
    if (session) {
      setCreateDropdownOpen(false);
      openCreateFolder();
    } else {
      dispatch("openLogin");
    }
  };

  const handleCreateStudySet = async (link: string) => {
    if (session) {
      await push(link);
    } else {
      dispatch("openLogin");
    }
  };

  return (
    <div className="sticky top-0 z-30 border-b bg-white">
      <div className="h-16 px-4 md:h-16">
        <div className="flex h-full justify-between">
          <div className="flex">
            <Link
              href="/"
              className="hidden h-full px-2 leading-[4rem] md:flex md:items-center"
            >
              <Image src="/logo.svg" alt="logo" width={110} height={24} />
            </Link>
            <div className="hidden h-full md:flex">
              <Link
                href="/"
                className="mx-3 hidden h-full text-lg font-medium leading-[4rem] lg:block"
              >
                Home
              </Link>
            </div>
            <div className="hidden items-center px-2 md:flex">
              <div className="relative">
                <button
                  onClick={toggleCreateDropdown}
                  className="flex items-center gap-2 rounded bg-blue-600 px-3 py-[6px] font-medium text-white hover:bg-blue-700"
                >
                  <span className="hidden lg:block">Create</span>
                  <ChevronDownIcon width={20} className="hidden lg:block" />
                  <PlusIcon width={20} className="lg:hidden" />
                </button>
                {createDropdownOpen && (
                  <div className="absolute top-[110%] left-0 min-w-[10rem] rounded-2xl border bg-white py-2 shadow-lg">
                    <button
                      onClick={() => handleCreateStudySet("/create-set")}
                      className="w-full px-6 py-2 text-start hover:bg-slate-100"
                    >
                      Study set
                    </button>
                    <button
                      onClick={handleCreateFolder}
                      className="w-full px-6 py-2 text-start hover:bg-slate-100"
                    >
                      Folder
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button onClick={openMobileMenu} className="md:hidden">
              <Bars3Icon width={32} height={32} />
            </button>
          </div>
          <div className="flex items-center">
            <div className="flex h-full items-center px-2">
              <div className="hidden max-w-[15rem] items-center gap-2 rounded-md border border-gray-200 bg-slate-100 px-2 py-1 lg:flex">
                <MagnifyingGlassIcon className="h-5 w-5" />
                <input
                  type="text"
                  placeholder="Study sets, textbooks, questions"
                  className="hidden flex-1 text-ellipsis bg-transparent pr-9 outline-none placeholder:text-base placeholder:font-medium placeholder:tracking-wider placeholder:text-black md:block"
                />
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-500 lg:hidden">
                <MagnifyingGlassIcon className="h-4 w-4" />
              </button>
            </div>
            {!session && (
              <>
                <div className="px-6">
                  <button
                    onClick={() => dispatch("openLogin")}
                    className="rounded px-2 py-1 hover:bg-indigo-50"
                  >
                    Log in
                  </button>
                </div>
                <button
                  onClick={() => dispatch("openSignup")}
                  className="rounded bg-amber-400 py-1 px-2 hover:bg-amber-300"
                >
                  <span>Sign up</span>
                </button>
              </>
            )}
            {session && session.user && (
              <div className="relative">
                <button
                  onClick={toggleMenuDropdown}
                  className="flex items-center"
                >
                  <ProfileImage
                    image={session.user.image}
                    userName={session.user.name}
                    size={32}
                    fontSize={16}
                  />
                </button>
                <div
                  className={`absolute top-[120%] right-0 z-20 min-w-[14rem] rounded-2xl border bg-white shadow-lg ${
                    menuDropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <div className="border-b">
                    <div className="flex items-center gap-4 py-4 px-6">
                      <ProfileImage
                        image={session.user.image}
                        userName={session.user.name}
                        size={32}
                        fontSize={16}
                      />
                      <div className="text-start">
                        <p className="text-sm">{session.user.name}</p>
                        <p className="max-w-[7rem] overflow-hidden text-ellipsis text-sm">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col border-b py-2">
                    <Link
                      href={`/${session.user.id}`}
                      className="py-2 px-6 text-start hover:bg-slate-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href={`settings`}
                      className="py-2 px-6 text-start hover:bg-slate-100"
                    >
                      Settings
                    </Link>
                    <button className="py-2 px-6 text-start hover:bg-slate-100">
                      Dark mode
                      <span className="ml-2 rounded-md bg-blue-700 px-2 text-sm text-white">
                        soon
                      </span>
                    </button>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => signOut()}
                      className="w-full whitespace-nowrap py-2 px-6 text-start hover:bg-slate-100"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
