"use client";
import { signIn } from "next-auth/react";
import Input from "@/app/components/input";
// import Image from "next/image";
import { ChangeEvent, useCallback, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Auth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const register = useCallback(async () => {
    try {
      console.log(password);
      await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });
    } catch (e) {
      console.log(e);
    }
  }, [email, name, password]);
  const login = useCallback(async () => {
    try {
      console.log(password);
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });
    } catch (e) {
      console.log(e);
    }
  }, [email, password]);

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="w-full h-full bg-black bg-opacity-50">
        <nav className="px-12 py-5">
          <h1 className="text-red-600 text-6xl font-extrabold">YANC</h1>
          {/* <Image */}
          {/*   src="/images/netflix-logo.png" */}
          {/*   alt="netflix logo" */}
          {/*   width={200} */}
          {/*   height={200} */}
          {/*   className="sm:self-center" */}
          {/* /> */}
        </nav>
        <div className="flex justify-center ">
          <div className="bg-white-0/10 bg-clip-padding backdrop-filter backdrop-blur-md p-16 self-center mt-2 lg:w-2/5 mx-auto rounded-lg shadow-lg border-white/20 border">
            <h2 className="font-semibold text-4xl mb-8 text-white">
              {isLogin ? "Sign In" : "Sign Up"}
            </h2>
            <div className="flex flex-col gap-4">
              {!isLogin && (
                <Input
                  id="name"
                  label="Username"
                  type="text"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value);
                  }}
                  value={name}
                />
              )}
              <Input
                id="email"
                label="Email"
                type="email"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
              <Input
                id="password"
                label="Password"
                type="password"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
                value={password}
              />
              <button
                onClick={isLogin ? login : register}
                className="bg-red-600 hover:drop-shadow-glow backdrop-blur-md hover:ring-1 hover:ring-red-500 text-white font-bold py-2 px-4 rounded-md"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
              <div className="flex flex-row items-center justify-center gap-4 my-8">
                <div
                  onClick={() => signIn("google", { redirectTo: "/" })}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition"
                >
                  <FcGoogle size={30} />
                </div>
                <div
                  onClick={() => signIn("github", { redirectTo: "/" })}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition"
                >
                  <FaGithub size={30} />
                </div>
              </div>

              <p className="text-center text-md text-zinc-400">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <span
                  className="text-white ml-1 font-semibold hover:underline cursor-pointer"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Register" : "Login"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
