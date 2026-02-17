"use client"
import Link from "next/link";
import { Button } from "./ui/button";
import { useUserStore } from "@/stores/user.store";

export default function NavBar() {
  const { user } = useUserStore();
  return (
    <nav className="w-full h-15 bg-[#f8f6fc] border flex justify-between items-center px-[15%]">
      <div className="w-auto flex justify-start items-center gap-8">
        <div className="flex justify-start items-center gap-2">
          <div className="w-5 h-5 flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="none"
            >
              <path
                d="M 100 136 C 111.046 136 120 144.954 120 156 L 120 256 L 100 256 C 44.772 256 0 211.228 0 156 L 0 136 Z M 256 256 L 136 256 L 136 156 C 136 144.954 144.954 136 156 136 L 256 136 Z M 120 100 C 120 111.046 111.046 120 100 120 L 0 120 L 0 100 C 0 44.772 44.772 0 100 0 L 120 0 Z M 156 0 C 211.228 0 256 44.772 256 100 L 256 120 L 156 120 C 144.954 120 136 111.046 136 100 L 136 0 Z"
                fill="#000000"
              ></path>
            </svg>
          </div>
          <h4 className="text-sm font-medium">TaskFlow</h4>
        </div>
        <div className="w-auto h-full flex justify-start items-center gap-5">
          <Link className="text-sm text-muted-foreground" href="/">
            Home
          </Link>
          {user && <Link className="text-sm text-muted-foreground" href="/dashboard">
            Dashboard
          </Link>}
          {/* <Link className="text-sm text-muted-foreground" href="/">
            Community
          </Link>
          <Link className="text-sm text-muted-foreground" href="/">
            Contact
          </Link> */}
        </div>
      </div>
      <div className="w-auto flex justify-start items-center gap-5">
        <Link
          href="/login"
          className="text-xs font-semibold text-black cursor-pointer"
        >
          LOG IN
        </Link>
        <Button variant="default" size="sm" className="text-xs bg-[#f87941]">
          <Link href="/register">GET STARTED</Link>
        </Button>
      </div>
    </nav>
  );
}
