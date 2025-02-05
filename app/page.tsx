import { auth } from "@/auth";

export const runtime = "edge";

export default async function Home() {
  const session = await auth();
  console.log(session!);

  return (
    <div className="flex h-screen mt-24">
      <h1 className="text-3xl font-bold">Nextflix</h1>
    </div>
  );
}
