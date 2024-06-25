'use client'

import NavbarHeader from "./components/navbar";

export default function Home() {
  return (
    <>
        <NavbarHeader/>
        <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
    </>
  );
}
