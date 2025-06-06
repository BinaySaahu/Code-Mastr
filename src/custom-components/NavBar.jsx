"use client";
import { addUser } from "@/app/data-store/slices/userSlice";
import { Button } from "@/components/ui/button";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { getSession, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const navigation = [
  { name: "Home", href: "/", current: true },
  // { name: "Contests", href: "/contest", current: false },
  //   { name: 'Projects', href: '#', current: false },
  //   { name: 'Calendar', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const [path, setPath] = useState("/");
  const pathName = usePathname();
  // const { status } = useSession();
  const router = useRouter();

  const USER = useSelector((state) => state.user);

  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const loadUser = async () => {
    try {
      const response = await fetch(
        `/api/getUser/?token=${localStorage.getItem("token")}`
      );
      const json = await response.json();
      console.log(response.status);
      if (json.status === 401) {
        logout();
        return;
      }
      if (!response.ok) {
        throw new Error(json.text);
      }
      console.log("User response->", json);
      dispatch(addUser(json.user));
      setUserData(json);
    } catch (error) {
      console.log(error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast("Session expired please Login again!!!")
    }
  };

  const getInitials = (name) => {
    const words = name.split(" ");

    if (words.length === 1) {
      return words[0][0] + words[0][1];
    } else {
      return words[0][0] + words[words.length - 1][0];
    }
  };

  // const getData = async () => {
  //   const session = await getSession();
  //   console.log(session);
  // };
  const logout = () => {
    // const redis = await getRedisClient();
    // let user = JSON.parse(localStorage.getItem('user'))
    // await redis.del(user.email)
    signOut();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.refresh();
  };
  useEffect(() => {
    // getData();
    let token = localStorage.getItem("token");
    if (token) {
      loadUser();
    }
  }, []);
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  return (
    <Disclosure
      as="nav"
      className="bg-[#343333] fixed top-0 left-0 w-full z-[10000]"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#2d2d2d] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href={"/"}>
                <img
                  alt="Your Company"
                  src="/logo-transparent.png"
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) =>
                  
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={item.href === path ? "page" : undefined}
                      className={classNames(
                        item.href === pathName
                          ? "bg-[#181818] text-white"
                          : "text-gray-300 hover:bg-[#2d2d2d]-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </Link>
                )}
                {
                  (USER.admin === true) && (
                    <Link
                      
                      href={'/add-problem'}
                      // aria-current={item.href === path ? "page" : undefined}
                      className={classNames(
                        pathName === '/add-problem'
                          ? "bg-[#181818] text-white"
                          : "text-gray-300 hover:bg-[#2d2d2d]-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >Add problem</Link>
                  )
                }
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {USER.email ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-[#343333] text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {/* <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full"
                    /> */}
                    <Avatar>
                      <AvatarImage src={USER.image}/>
                      {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                      <AvatarFallback>{getInitials(USER.name)}</AvatarFallback>
                    </Avatar>
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                   <MenuItem>
                    <Link
                      href={`/dashboard/${USER.userId}`}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Your Profile
                    </Link>
                  </MenuItem>
                  {/*<MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Settings
                    </a>
                  </MenuItem> */}
                  <MenuItem>
                    <p
                      onClick={logout}
                      className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Sign out
                    </p>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <Link
                href="/accounts/login"
                className="ml-4 text-base cursor-pointer"
              >
                Login/Signup
              </Link>
            )}
          </div>
          {/* <p
            onClick={logout}
            className="ml-4 text-base cursor-pointer"
          >
            Logout
          </p> */}
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2 h-">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                pathName === item.href
                  ? "bg-[#000000] text-white"
                  : "text-gray-300 hover:bg-[#2d2d2d]-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
          {USER.admin && (
            <DisclosureButton
              as="a"
              href="/add-problem"
              className={classNames(
                pathName === "/add-problem"
                  ? "bg-[#000000] text-white"
                  : "text-gray-300 hover:bg-[#2d2d2d]-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              Add problem
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
